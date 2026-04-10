#!/usr/bin/env python3
"""
OAR Pro v4 — Content Math Normalizer
Fixes broken HTML entities (&sup4-9, &sub0-9 — not valid HTML entities)
and converts <code> math blocks to proper unicode / MathJax so every
lesson and question renders consistently.

Strategy:
  - Unicode for simple atomic math (x², x₁, √, π, ±, °, ·, ×, ÷, ½, ⁰¹²³…)
  - MathJax (\(...\)) only for expressions with compound exponents (x^(a+b), 2^(x+1))
  - Leaves existing working \\\\(...\\\\) MathJax alone

Usage:  python3 fix_math_content.py
— Benjamin Rodriguez
"""

import re
import os

SQL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '003_seed_content.sql')

# ---------- Entity maps ----------
# Full unicode superscript coverage — letters a-z + digits + signs
SUP = {
    '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
    '+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾',
    'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ',
    'j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','r':'ʳ','s':'ˢ',
    't':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ',
    'A':'ᴬ','B':'ᴮ','D':'ᴰ','E':'ᴱ','G':'ᴳ','H':'ᴴ','I':'ᴵ','J':'ᴶ','K':'ᴷ',
    'L':'ᴸ','M':'ᴹ','N':'ᴺ','O':'ᴼ','P':'ᴾ','R':'ᴿ','T':'ᵀ','U':'ᵁ','V':'ⱽ','W':'ᵂ',
}
SUB = {
    '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
    '+':'₊','-':'₋','=':'₌','(':'₍',')':'₎',
    'a':'ₐ','e':'ₑ','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ',
    'o':'ₒ','p':'ₚ','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','x':'ₓ',
}

ENTITY_MAP = {
    # Broken — not valid HTML entities, currently showing literally
    '&sup4;':'⁴','&sup5;':'⁵','&sup6;':'⁶','&sup7;':'⁷','&sup8;':'⁸','&sup9;':'⁹','&sup0;':'⁰',
    '&sub0;':'₀','&sub1;':'₁','&sub2;':'₂','&sub3;':'₃','&sub4;':'₄',
    '&sub5;':'₅','&sub6;':'₆','&sub7;':'₇','&sub8;':'₈','&sub9;':'₉',
    # Valid entities — normalize to unicode for consistency + cleaner DB
    '&sup1;':'¹','&sup2;':'²','&sup3;':'³',
    '&frac12;':'½','&frac13;':'⅓','&frac14;':'¼','&frac23;':'⅔','&frac34;':'¾',
    '&frac15;':'⅕','&frac25;':'⅖','&frac35;':'⅗','&frac45;':'⅘',
    '&frac18;':'⅛','&frac38;':'⅜','&frac58;':'⅝','&frac78;':'⅞',
    '&radic;':'√','&pi;':'π','&theta;':'θ','&alpha;':'α','&beta;':'β',
    '&Delta;':'Δ','&delta;':'δ','&mu;':'μ','&sigma;':'σ','&omega;':'ω','&Omega;':'Ω',
    '&infin;':'∞','&ne;':'≠','&le;':'≤','&ge;':'≥','&asymp;':'≈',
    '&plusmn;':'±','&minus;':'−','&times;':'×','&divide;':'÷','&middot;':'·',
    '&deg;':'°','&permil;':'‰',
    # Common typographical — leave &mdash; &rarr; &amp; alone if they work,
    # but normalize the common ones for cleaner display
    '&rarr;':'→','&larr;':'←','&uarr;':'↑','&darr;':'↓',
    '&harr;':'↔','&hellip;':'…',
}

def fix_entities(text):
    """Replace broken + noisy entities with unicode."""
    for k, v in ENTITY_MAP.items():
        text = text.replace(k, v)
    return text


def _sup_sequence(s):
    """Convert a string of digits/letters/+-/() to unicode superscript if every char is mappable."""
    out = []
    for ch in s:
        if ch in SUP:
            out.append(SUP[ch])
        else:
            return None  # Can't represent — caller should use MathJax
    return ''.join(out)


def fix_caret_exponents(text):
    """
    Convert x^N, x^a, 2^5, x^(a+b) etc to unicode superscripts.
    Pure unicode — no MathJax — so it always renders, no escaping headaches.

    Falls back to styled <sup> HTML tag if unicode can't represent the expression.
    """
    # 1) Compound exponents with parens:  base^(expr)  →  unicode superscript or <sup>
    #    Base can be letter, digit, or closing paren — e.g., (x+1)^2, x^(a+b)
    def compound(m):
        base = m.group(1)
        expr = m.group(2)
        sup = _sup_sequence(expr)
        if sup is not None:
            return base + sup
        return f'{base}<sup>{expr}</sup>'
    text = re.sub(r'([A-Za-z0-9\)])\^\(([^)]+)\)', compound, text)

    # 2) Simple exponents:  base^N or base^letter  →  unicode or <sup>
    def simple(m):
        base = m.group(1)
        exp = m.group(2)
        sup = _sup_sequence(exp)
        if sup is not None:
            return base + sup
        return f'{base}<sup>{exp}</sup>'
    text = re.sub(r'([A-Za-z0-9\)])\^([A-Za-z0-9]+)', simple, text)

    return text


def unwrap_empty_code(text):
    """
    <code> wrapping pure math like <code>x² + bx + c</code> is stylistically wrong —
    code font hurts legibility for math. Convert <code>…</code> blocks whose contents
    are math-y (contain unicode math chars or are short) to <em> or plain.
    Only unwrap code blocks that look like math (no keywords / identifiers / punctuation-heavy).
    """
    def replace(m):
        inner = m.group(1)
        # If it contains any of: math unicode, =, +, -, ², √, π, superscripts — treat as math
        math_chars = set('⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉√π±×÷·≤≥≠°½⅓¼⅔¾ΔΣ')
        has_math = any(ch in math_chars for ch in inner) or '=' in inner or bool(re.search(r'[a-zA-Z]\d', inner))
        if has_math and len(inner) < 120 and '<' not in inner:
            # Keep as-is but swap <code> for styled math span — keep monospace off but keep emphasis
            return f'<span class="math-inline">{inner}</span>'
        return m.group(0)
    return re.sub(r'<code>([^<]+)</code>', replace, text)


def _sub_sequence(s):
    """Convert a string to unicode subscript if every char is mappable."""
    out = []
    for ch in s:
        if ch in SUB:
            out.append(SUB[ch])
        else:
            return None
    return ''.join(out)


def fix_underscore_subscripts(text):
    """
    Convert base_sub → unicode subscript or <sub> fallback.

    Handles:
      v_0, x_1, H_2O    → unicode (digits)
      log_b, R_total    → HTML <sub> (letters, since not all letters have subscript unicode)
      a_c               → HTML <sub>
      v_{xi}, R_1,2     → HTML <sub>

    Only acts inside math-y contexts (<code>, math-inline spans) to avoid
    munging snake_case variable names in code samples or URLs.
    """
    def replace_sub(m):
        base = m.group(1)
        sub = m.group(2)
        # Prefer unicode for pure-digit subscripts (cleanest)
        if sub.isdigit():
            unicode_sub = _sub_sequence(sub)
            if unicode_sub is not None:
                return base + unicode_sub
        # Otherwise HTML <sub> — guaranteed to render
        return f'{base}<sub>{sub}</sub>'

    # Match: one-or-more-letters base, underscore, identifier-ish subscript
    # e.g., log_b, R_total, v_0, x_1, H_2, a_c
    sub_pattern = re.compile(r'([A-Za-z]+)_([A-Za-z0-9]{1,6})')

    def in_math_span(m):
        return m.group(1) + sub_pattern.sub(replace_sub, m.group(2)) + m.group(3)

    # Inside <span class="math-inline">...</span>
    text = re.sub(
        r'(<span class="math-inline">)([^<]*)(</span>)',
        in_math_span,
        text
    )
    # Inside <code>...</code>
    text = re.sub(
        r'(<code>)([^<]*)(</code>)',
        in_math_span,
        text
    )

    # Also catch common physics variable subscripts in prose:
    # R_total, V_total, I_total, R_1, v_0, v_f, v_i, a_c, x_i, x_f, t_0, K_e, P_in, P_out
    # Also common abbreviations: RPM_B, KE_i, PE_f, FPS_0
    PHYSICS_VARS = {'R','V','I','P','F','E','T','M','K','U','Q','N','W','L','C','H','D','B','A',
                    'v','a','x','y','t','r','p','k','m','d','f','s','h','n','q','g',
                    'RPM','KE','PE','FPS','RPS','GPE','GPa','MPa','kPa'}
    SUB_WORDS = {'total','net','max','min','avg','eff','in','out','ext','int','initial','final',
                 '0','1','2','3','4','5','6','7','8','9',
                 'i','f','c','e','x','y','z','p','n','r','t','s','b','A','B','C','D',
                 '0f','0i'}
    def replace_physics(m):
        base = m.group(1)
        sub = m.group(2)
        if base not in PHYSICS_VARS:
            return m.group(0)
        if sub not in SUB_WORDS:
            return m.group(0)
        if sub.isdigit() and _sub_sequence(sub) is not None:
            return base + _sub_sequence(sub)
        return f'{base}<sub>{sub}</sub>'
    # Allow 1-3 letter base
    text = re.sub(r'\b([A-Za-z]{1,3})_([A-Za-z0-9]{1,6})\b', replace_physics, text)

    return text


def protect_mathjax(text):
    """
    Replace \\\\[...\\\\] and \\\\(...\\\\) MathJax blocks (and their inline
    equivalents) with opaque placeholders so our prose fixers don't damage LaTeX.
    Returns (protected_text, mapping).
    """
    mapping = {}
    counter = [0]

    def stash(m):
        key = f'\x00MATHJAX_{counter[0]}\x00'
        mapping[key] = m.group(0)
        counter[0] += 1
        return key

    # Display blocks: \\\\[ ... \\\\]
    text = re.sub(r'\\\\\\\\\[.*?\\\\\\\\\]', stash, text, flags=re.DOTALL)
    # Inline: \\\\( ... \\\\)
    text = re.sub(r'\\\\\\\\\(.*?\\\\\\\\\)', stash, text, flags=re.DOTALL)
    # Also the 2-backslash variants in case they exist
    text = re.sub(r'\\\\\[.*?\\\\\]', stash, text, flags=re.DOTALL)
    text = re.sub(r'\\\\\(.*?\\\\\)', stash, text, flags=re.DOTALL)
    return text, mapping


def restore_mathjax(text, mapping):
    for key, original in mapping.items():
        text = text.replace(key, original)
    return text


def fix_content(text):
    # 1) Protect existing MathJax formulas from our prose fixers
    text, mapping = protect_mathjax(text)
    # 2) Run fixers on prose / broken HTML
    text = fix_entities(text)
    text = fix_caret_exponents(text)
    text = unwrap_empty_code(text)
    text = fix_underscore_subscripts(text)
    # 3) Put the protected MathJax back
    text = restore_mathjax(text, mapping)
    return text


def main():
    with open(SQL_FILE, 'r', encoding='utf-8') as f:
        sql = f.read()

    original = sql
    fixed = fix_content(sql)

    # Stats
    changes = 0
    for i, (a, b) in enumerate(zip(original, fixed)):
        if a != b:
            changes += 1
            break

    if fixed == original:
        print("No changes needed — content already clean.")
        return

    # Backup
    backup_path = SQL_FILE + '.bak'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original)
    print(f"Backup written to {backup_path}")

    with open(SQL_FILE, 'w', encoding='utf-8') as f:
        f.write(fixed)

    # Report
    def count(needle, s):
        return s.count(needle)

    broken_before = sum(count(e, original) for e in ['&sup4;','&sup5;','&sup6;','&sup7;','&sup8;','&sup9;','&sub0;','&sub1;','&sub2;','&sub3;','&sub4;','&sub5;','&sub6;','&sub7;','&sub8;','&sub9;'])
    broken_after = sum(count(e, fixed) for e in ['&sup4;','&sup5;','&sup6;','&sup7;','&sup8;','&sup9;','&sub0;','&sub1;','&sub2;','&sub3;','&sub4;','&sub5;','&sub6;','&sub7;','&sub8;','&sub9;'])
    code_math_before = len(re.findall(r'<code>[^<]*\^', original))
    code_math_after = len(re.findall(r'<code>[^<]*\^', fixed))

    print(f"Broken entities (&sup4-9 / &sub0-9): {broken_before} → {broken_after}")
    print(f"<code> blocks with ^ notation:        {code_math_before} → {code_math_after}")
    print(f"Bytes changed: {len(original)} → {len(fixed)}")
    print("\nDone. Next steps:")
    print("  1. Review git diff supabase/migrations/003_seed_content.sql")
    print("  2. Re-run seed in Supabase SQL editor (uses ON CONFLICT DO UPDATE — idempotent)")
    print("  3. Hard refresh the live site to verify")


if __name__ == '__main__':
    main()
