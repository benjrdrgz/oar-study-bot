-- Migration 010: Fix double-escaped LaTeX backslashes in lesson content
-- Root cause: content was stored with \\[ instead of \[ for MathJax delimiters
-- Affects 15 of 20 lessons (all math/mechanical content, not reading lessons)
-- chr(92) = backslash character — avoids string literal escaping ambiguity

UPDATE lessons
SET content_html = replace(content_html, chr(92)||chr(92), chr(92))
WHERE position(chr(92)||chr(92) IN content_html) > 0;

-- Verify: should return 0 rows after fix
-- SELECT id, title FROM lessons WHERE position(chr(92)||chr(92) IN content_html) > 0;
