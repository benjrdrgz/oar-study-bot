// OAR Pro v4 — Onboarding Flow (Multi-Step)
// Route: #/onboarding
// Steps: Welcome -> Profile -> Diagnostic (15 Qs) -> Results -> Start

// Hardcoded diagnostic questions (not from Supabase — user may not be paid yet)
const DIAGNOSTIC_QUESTIONS = {
  math: [
    {
      id: 'd_m1', topic: 'Order of Operations',
      text: 'Evaluate: 3 + 4 \u00d7 2 - 1',
      options: ['13', '10', '9', '14'],
      correct: 1, // 3 + 8 - 1 = 10
      explanation: 'PEMDAS: Multiplication first. 4 \u00d7 2 = 8, then 3 + 8 - 1 = 10.'
    },
    {
      id: 'd_m2', topic: 'Fractions',
      text: 'What is 2/3 + 1/4?',
      options: ['3/7', '11/12', '5/6', '3/12'],
      correct: 1,
      explanation: 'Common denominator is 12: 8/12 + 3/12 = 11/12.'
    },
    {
      id: 'd_m3', topic: 'Percent Change',
      text: 'A shirt originally costs $40 and is marked down to $30. What is the percent decrease?',
      options: ['10%', '25%', '33%', '75%'],
      correct: 1,
      explanation: 'Percent decrease = (40-30)/40 \u00d7 100 = 25%.'
    },
    {
      id: 'd_m4', topic: 'Distance Formula',
      text: 'A car travels 60 mph for 2.5 hours. How far does it go?',
      options: ['120 miles', '130 miles', '150 miles', '180 miles'],
      correct: 2,
      explanation: 'Distance = Rate \u00d7 Time = 60 \u00d7 2.5 = 150 miles.'
    },
    {
      id: 'd_m5', topic: 'Algebra',
      text: 'Solve for x: 3x + 7 = 22',
      options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
      correct: 1,
      explanation: '3x = 22 - 7 = 15, so x = 15/3 = 5.'
    }
  ],
  reading: [
    {
      id: 'd_r1', topic: 'Main Idea',
      text: 'Read the passage: "The Amazon rainforest produces approximately 20% of the world\'s oxygen. It contains 10% of all known species. Deforestation threatens this vital ecosystem, with an area the size of a football field cleared every minute." What is the main idea?',
      options: [
        'Football fields are large',
        'The Amazon is a critical ecosystem under threat',
        'Oxygen is important for life',
        'Species diversity is increasing'
      ],
      correct: 1,
      explanation: 'The passage centers on the Amazon\'s importance and the threat of deforestation.'
    },
    {
      id: 'd_r2', topic: 'Inference',
      text: '"After the third attempt to start the engine failed, Maria grabbed her phone and began scrolling through her contacts." What can you infer Maria is about to do?',
      options: [
        'Check social media',
        'Take a photo of the car',
        'Call someone for help',
        'Look up directions'
      ],
      correct: 2,
      explanation: 'After a failed car start, scrolling contacts implies she\'s looking for someone to call for help.'
    },
    {
      id: 'd_r3', topic: 'Author\'s Purpose',
      text: 'An article states: "Studies show that employees who take regular breaks are 15% more productive. Companies that mandate break periods see lower turnover rates." The author\'s primary purpose is to:',
      options: [
        'Entertain readers with stories about work',
        'Persuade readers that breaks improve productivity',
        'Describe the history of work breaks',
        'Compare different companies'
      ],
      correct: 1,
      explanation: 'The author uses data to argue that breaks improve productivity \u2014 a persuasive purpose.'
    },
    {
      id: 'd_r4', topic: 'Vocabulary in Context',
      text: '"The company\'s unprecedented growth shocked analysts who had predicted a modest quarter." In this context, "unprecedented" most nearly means:',
      options: [
        'Expected',
        'Gradual',
        'Never before seen',
        'Controversial'
      ],
      correct: 2,
      explanation: 'Unprecedented means having no previous example \u2014 never before seen.'
    },
    {
      id: 'd_r5', topic: 'Text Organization',
      text: 'A passage begins with a thesis, presents three supporting arguments with evidence, then restates the thesis with a call to action. This structure is best described as:',
      options: [
        'Chronological',
        'Cause and effect',
        'Persuasive essay',
        'Narrative'
      ],
      correct: 2,
      explanation: 'Thesis + supporting arguments + call to action = persuasive essay structure.'
    }
  ],
  mechanical: [
    {
      id: 'd_mc1', topic: 'Force and Motion',
      text: 'A 10 kg box is pushed with a force of 50 N. Assuming no friction, what is its acceleration?',
      options: ['0.5 m/s\u00b2', '5 m/s\u00b2', '50 m/s\u00b2', '500 m/s\u00b2'],
      correct: 1,
      explanation: 'F = ma, so a = F/m = 50/10 = 5 m/s\u00b2.'
    },
    {
      id: 'd_mc2', topic: 'Levers',
      text: 'A lever has the fulcrum between the effort and the load. This is a:',
      options: ['First-class lever', 'Second-class lever', 'Third-class lever', 'Compound lever'],
      correct: 0,
      explanation: 'Fulcrum between effort and load = first-class lever (like a seesaw).'
    },
    {
      id: 'd_mc3', topic: 'Gears',
      text: 'If Gear A turns clockwise and meshes with Gear B, which direction does Gear B turn?',
      options: ['Clockwise', 'Counter-clockwise', 'It depends on size', 'Neither \u2014 it stays still'],
      correct: 1,
      explanation: 'Meshed gears always turn in opposite directions.'
    },
    {
      id: 'd_mc4', topic: 'Pulleys',
      text: 'A fixed pulley is used to lift a 100 lb load. What effort is required (ignoring friction)?',
      options: ['50 lb', '100 lb', '200 lb', '25 lb'],
      correct: 1,
      explanation: 'A single fixed pulley changes direction but provides no mechanical advantage. Effort = Load = 100 lb.'
    },
    {
      id: 'd_mc5', topic: 'Pressure',
      text: 'A force of 200 N is applied over an area of 4 m\u00b2. What is the pressure?',
      options: ['800 Pa', '50 Pa', '200 Pa', '4 Pa'],
      correct: 1,
      explanation: 'Pressure = Force / Area = 200 N / 4 m\u00b2 = 50 Pa.'
    }
  ]
};

// Onboarding state
let onboardingState = {
  step: 1,
  name: '',
  testDate: '',
  answers: {},
  currentQ: 0,
  allQuestions: []
};

route('/onboarding', async () => {
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('app').classList.add('full-width');
  document.getElementById('mobileToggle').style.display = 'none';

  // Reset state
  onboardingState = {
    step: 1,
    name: '',
    testDate: '',
    answers: {},
    currentQ: 0,
    allQuestions: [
      ...DIAGNOSTIC_QUESTIONS.math.map(q => ({ ...q, section: 'math' })),
      ...DIAGNOSTIC_QUESTIONS.reading.map(q => ({ ...q, section: 'reading' })),
      ...DIAGNOSTIC_QUESTIONS.mechanical.map(q => ({ ...q, section: 'mechanical' }))
    ]
  };

  // Pre-fill name from profile if available
  const profile = await getProfile();
  if (profile?.display_name) {
    onboardingState.name = profile.display_name;
  }

  renderOnboardingStep();
});

function renderOnboardingStep() {
  const app = document.getElementById('app');
  const { step } = onboardingState;

  // Progress indicator
  const totalSteps = 5;
  const progressBar = `
    <div style="max-width:500px;margin:0 auto 32px;display:flex;gap:6px">
      ${Array.from({ length: totalSteps }, (_, i) => `
        <div style="flex:1;height:4px;border-radius:2px;background:${i < step ? 'var(--accent)' : 'var(--surface-2)'}"></div>
      `).join('')}
    </div>
    <div style="text-align:center;font-size:12px;color:var(--text-3);margin-bottom:24px">Step ${step} of ${totalSteps}</div>
  `;

  switch (step) {
    case 1:
      app.innerHTML = `
        <div style="max-width:500px;margin:80px auto;text-align:center">
          ${progressBar}
          <div style="font-size:48px;margin-bottom:16px">&#9875;</div>
          <h1 style="font-size:30px;font-weight:800;letter-spacing:-1px;margin-bottom:12px">Let's Personalize Your Study Plan</h1>
          <p style="color:var(--text-2);font-size:16px;line-height:1.7;margin-bottom:36px">
            We'll start with a quick diagnostic to identify your strengths and weak spots, then build a custom study plan just for you.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;max-width:320px;margin:0 auto">
            <button class="btn btn-primary btn-lg btn-block" onclick="onboardingNext()">Get Started &rarr;</button>
            <button class="btn btn-secondary btn-block" onclick="skipOnboarding()">Skip &mdash; I'll explore on my own</button>
          </div>
          <div style="margin-top:32px;display:flex;justify-content:center;gap:24px;font-size:13px;color:var(--text-3)">
            <span>&#9201; ~5 minutes</span>
            <span>&#128221; 15 questions</span>
            <span>&#127919; 3 sections</span>
          </div>
        </div>
      `;
      break;

    case 2:
      app.innerHTML = `
        <div style="max-width:440px;margin:80px auto;text-align:center">
          ${progressBar}
          <h2 style="font-size:24px;font-weight:800;margin-bottom:8px">Tell Us About Yourself</h2>
          <p style="color:var(--text-2);font-size:14px;margin-bottom:28px">This helps us tailor your study plan</p>
          <div class="card" style="text-align:left">
            <div class="form-group">
              <label class="form-label">Your Name</label>
              <input type="text" class="form-input" id="obName" value="${onboardingState.name}" placeholder="First name or nickname">
            </div>
            <div class="form-group">
              <label class="form-label">Target Test Date (optional)</label>
              <input type="date" class="form-input" id="obTestDate" value="${onboardingState.testDate}" min="${new Date().toISOString().split('T')[0]}">
              <div style="font-size:12px;color:var(--text-3);margin-top:4px">We'll adjust your study pace accordingly</div>
            </div>
            <button class="btn btn-primary btn-lg btn-block" onclick="onboardingStep2Submit()">Continue &rarr;</button>
          </div>
        </div>
      `;
      break;

    case 3:
      renderDiagnosticQuestion();
      break;

    case 4:
      renderDiagnosticResults();
      break;

    case 5:
      app.innerHTML = `
        <div style="max-width:500px;margin:80px auto;text-align:center">
          ${progressBar}
          <div style="font-size:48px;margin-bottom:16px">&#127881;</div>
          <h2 style="font-size:28px;font-weight:800;margin-bottom:12px">You're All Set!</h2>
          <p style="color:var(--text-2);font-size:16px;line-height:1.7;margin-bottom:32px">
            Your personalized study plan is ready. Start with your weakest areas first for maximum improvement.
          </p>
          <button class="btn btn-primary btn-lg" onclick="navigate('#/dashboard')" style="padding:18px 48px;font-size:17px">
            Start Studying &rarr;
          </button>
        </div>
      `;
      break;
  }
}

function renderDiagnosticQuestion() {
  const app = document.getElementById('app');
  const { currentQ, allQuestions, answers } = onboardingState;
  const q = allQuestions[currentQ];
  const total = allQuestions.length;

  // Section label
  const sectionLabels = { math: 'Math Skills', reading: 'Reading Comprehension', mechanical: 'Mechanical Comprehension' };
  const sectionColors = { math: 'var(--accent)', reading: 'var(--green)', mechanical: 'var(--yellow)' };

  const prevAnswer = answers[q.id];

  app.innerHTML = `
    <div style="max-width:640px;margin:40px auto;padding:0 20px">
      <!-- Progress -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <span class="badge" style="background:${sectionColors[q.section]}22;color:${sectionColors[q.section]}">${sectionLabels[q.section]}</span>
        <span style="font-size:13px;color:var(--text-3)">Question ${currentQ + 1} of ${total}</span>
      </div>
      <div style="height:4px;background:var(--surface-2);border-radius:2px;margin-bottom:32px;overflow:hidden">
        <div style="height:100%;width:${((currentQ + 1) / total) * 100}%;background:var(--accent);border-radius:2px;transition:width .3s"></div>
      </div>

      <!-- Question -->
      <div class="card" style="margin-bottom:24px">
        <div style="font-size:12px;color:var(--text-3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">${q.topic}</div>
        <p style="font-size:17px;font-weight:600;line-height:1.6">${q.text}</p>
      </div>

      <!-- Options -->
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px">
        ${q.options.map((opt, i) => {
          const selected = prevAnswer !== undefined && prevAnswer.selected === i;
          return `
            <button class="btn btn-secondary btn-block diagnostic-opt" data-idx="${i}"
              style="text-align:left;padding:16px 20px;font-size:15px;${selected ? 'border-color:var(--accent);background:var(--accent-glow)' : ''}"
              onclick="selectDiagnosticAnswer(${i})">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;border:2px solid ${selected ? 'var(--accent)' : 'var(--border)'};margin-right:12px;font-size:13px;font-weight:700;flex-shrink:0;${selected ? 'background:var(--accent);color:white;border-color:var(--accent)' : ''}">${String.fromCharCode(65 + i)}</span>
              ${opt}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Navigation -->
      <div style="display:flex;justify-content:space-between">
        ${currentQ > 0 ? `<button class="btn btn-secondary" onclick="diagnosticPrev()">&larr; Previous</button>` : '<div></div>'}
        ${currentQ < total - 1
          ? `<button class="btn btn-primary" id="diagNextBtn" ${prevAnswer === undefined ? 'disabled style="opacity:0.5"' : ''} onclick="diagnosticNext()">Next &rarr;</button>`
          : `<button class="btn btn-primary" id="diagNextBtn" ${prevAnswer === undefined ? 'disabled style="opacity:0.5"' : ''} onclick="finishDiagnostic()">Finish &rarr;</button>`
        }
      </div>
    </div>
  `;
}

function selectDiagnosticAnswer(idx) {
  const q = onboardingState.allQuestions[onboardingState.currentQ];
  onboardingState.answers[q.id] = {
    selected: idx,
    correct: idx === q.correct,
    topic: q.topic,
    section: q.section
  };

  // Highlight selected option
  document.querySelectorAll('.diagnostic-opt').forEach((btn, i) => {
    const isSelected = i === idx;
    btn.style.borderColor = isSelected ? 'var(--accent)' : 'var(--border)';
    btn.style.background = isSelected ? 'var(--accent-glow)' : '';
    const circle = btn.querySelector('span');
    if (circle) {
      circle.style.background = isSelected ? 'var(--accent)' : '';
      circle.style.color = isSelected ? 'white' : '';
      circle.style.borderColor = isSelected ? 'var(--accent)' : 'var(--border)';
    }
  });

  // Enable next button
  const nextBtn = document.getElementById('diagNextBtn');
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
  }
}

function diagnosticNext() {
  onboardingState.currentQ++;
  renderDiagnosticQuestion();
}

function diagnosticPrev() {
  if (onboardingState.currentQ > 0) {
    onboardingState.currentQ--;
    renderDiagnosticQuestion();
  }
}

async function finishDiagnostic() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="max-width:400px;margin:120px auto;text-align:center">
      <div class="skeleton skeleton-title" style="margin:0 auto 16px"></div>
      <div class="skeleton skeleton-text" style="width:80%;margin:0 auto"></div>
      <p style="color:var(--text-3);margin-top:16px;font-size:14px">Analyzing your results...</p>
    </div>
  `;

  // Save results to Supabase
  try {
    const user = await getUser();
    if (user) {
      // Calculate scores by section
      const sectionResults = { math: { correct: 0, total: 0 }, reading: { correct: 0, total: 0 }, mechanical: { correct: 0, total: 0 } };
      for (const ans of Object.values(onboardingState.answers)) {
        sectionResults[ans.section].total++;
        if (ans.correct) sectionResults[ans.section].correct++;
      }

      const totalCorrect = Object.values(sectionResults).reduce((sum, s) => sum + s.correct, 0);
      const totalQuestions = Object.values(sectionResults).reduce((sum, s) => sum + s.total, 0);

      // Save quiz result
      await Store.saveQuizResult(
        'diagnostic',
        'all',
        totalQuestions,
        totalCorrect,
        0,
        onboardingState.answers
      );

      // Update profile
      const updates = { onboarding_complete: true };
      if (onboardingState.name) updates.display_name = onboardingState.name;
      if (onboardingState.testDate) updates.test_date = onboardingState.testDate;
      await Store.updateProfile(updates);
    }
  } catch (err) {
    console.error('Failed to save diagnostic results:', err);
  }

  onboardingState.step = 4;
  renderOnboardingStep();
}

function renderDiagnosticResults() {
  const app = document.getElementById('app');
  const { answers, allQuestions } = onboardingState;

  // Calculate by section
  const sectionResults = {};
  const topicResults = {};

  for (const q of allQuestions) {
    const ans = answers[q.id];
    if (!sectionResults[q.section]) sectionResults[q.section] = { correct: 0, total: 0, topics: {} };
    sectionResults[q.section].total++;
    if (ans?.correct) sectionResults[q.section].correct++;

    if (!topicResults[q.topic]) topicResults[q.topic] = { section: q.section, correct: 0, total: 0 };
    topicResults[q.topic].total++;
    if (ans?.correct) topicResults[q.topic].correct++;
  }

  // Identify strengths and weaknesses
  const strengths = [];
  const weaknesses = [];
  for (const [topic, stats] of Object.entries(topicResults)) {
    const acc = stats.correct / stats.total;
    if (acc >= 0.8) strengths.push(topic);
    else if (acc < 0.6) weaknesses.push(topic);
  }

  const sectionLabels = { math: 'Math Skills', reading: 'Reading Comprehension', mechanical: 'Mechanical Comprehension' };
  const sectionColors = { math: 'var(--accent)', reading: 'var(--green)', mechanical: 'var(--yellow)' };

  const totalCorrect = Object.values(sectionResults).reduce((s, r) => s + r.correct, 0);
  const totalQs = allQuestions.length;
  const overallPct = Math.round((totalCorrect / totalQs) * 100);

  app.innerHTML = `
    <div style="max-width:600px;margin:60px auto;padding:0 20px">
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:48px;margin-bottom:12px">${overallPct >= 80 ? '&#127775;' : overallPct >= 60 ? '&#128170;' : '&#127919;'}</div>
        <h2 style="font-size:28px;font-weight:800;margin-bottom:8px">Diagnostic Results</h2>
        <p style="color:var(--text-2);font-size:16px">You got <strong>${totalCorrect}/${totalQs}</strong> correct (${overallPct}%)</p>
      </div>

      <!-- Section Breakdown -->
      <div class="grid-3" style="margin-bottom:28px">
        ${Object.entries(sectionResults).map(([sec, data]) => {
          const pct = Math.round((data.correct / data.total) * 100);
          return `
            <div class="card" style="text-align:center">
              <div style="font-size:13px;color:${sectionColors[sec]};font-weight:700;margin-bottom:8px">${sectionLabels[sec]}</div>
              <div style="font-size:32px;font-weight:800">${pct}%</div>
              <div style="font-size:12px;color:var(--text-3)">${data.correct}/${data.total} correct</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Strengths & Weaknesses -->
      <div class="grid-2" style="margin-bottom:28px">
        <div class="card">
          <h3 style="font-size:14px;font-weight:700;color:var(--green);margin-bottom:10px">&#10003; Your Strengths</h3>
          ${strengths.length
            ? strengths.map(t => `<div style="font-size:14px;padding:4px 0;color:var(--text-2)">${t}</div>`).join('')
            : '<div style="font-size:13px;color:var(--text-3)">Keep practicing to build strengths!</div>'
          }
        </div>
        <div class="card">
          <h3 style="font-size:14px;font-weight:700;color:var(--red);margin-bottom:10px">&#9888; Focus Areas</h3>
          ${weaknesses.length
            ? weaknesses.map(t => `<div style="font-size:14px;padding:4px 0;color:var(--text-2)">${t}</div>`).join('')
            : '<div style="font-size:13px;color:var(--text-3)">Great start \u2014 no major weak spots!</div>'
          }
        </div>
      </div>

      <!-- Study Plan Preview -->
      <div class="card" style="margin-bottom:28px">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:12px">Your Personalized Study Plan</h3>
        <p style="font-size:14px;color:var(--text-2);line-height:1.6;margin-bottom:16px">
          Based on your diagnostic, we recommend focusing on:
        </p>
        <ol style="padding-left:20px;font-size:14px;color:var(--text-2);line-height:2">
          ${weaknesses.length
            ? weaknesses.map(t => `<li><strong style="color:var(--text)">${t}</strong> &mdash; priority review</li>`).join('')
            : ''
          }
          ${Object.entries(sectionResults)
            .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
            .map(([sec]) => `<li>${sectionLabels[sec]} lessons &amp; practice</li>`)
            .join('')
          }
          <li>Adaptive test simulation before your exam</li>
        </ol>
        ${onboardingState.testDate
          ? `<div class="callout callout-tip" style="margin-top:16px">
              <div class="callout-title">Test Day</div>
              Your target date is <strong>${new Date(onboardingState.testDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
              We'll pace your study plan accordingly.
            </div>`
          : ''
        }
      </div>

      <!-- Question Review (collapsible) -->
      <details style="margin-bottom:28px">
        <summary style="cursor:pointer;font-size:15px;font-weight:700;padding:12px 0;color:var(--text-2)">Review Your Answers</summary>
        <div style="margin-top:12px;display:flex;flex-direction:column;gap:10px">
          ${allQuestions.map((q, i) => {
            const ans = answers[q.id];
            const isCorrect = ans?.correct;
            return `
              <div class="card" style="padding:16px;border-color:${isCorrect ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)'}">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                  <span style="font-size:12px;color:var(--text-3)">${q.topic}</span>
                  <span class="badge ${isCorrect ? 'badge-green' : 'badge-red'}">${isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
                <p style="font-size:14px;font-weight:600;margin-bottom:8px">${q.text.length > 120 ? q.text.substring(0, 120) + '...' : q.text}</p>
                ${!isCorrect ? `
                  <div style="font-size:13px;color:var(--text-2)">
                    <span style="color:var(--red)">Your answer:</span> ${q.options[ans?.selected]} &nbsp;|&nbsp;
                    <span style="color:var(--green)">Correct:</span> ${q.options[q.correct]}
                  </div>
                ` : ''}
                <div style="font-size:12px;color:var(--text-3);margin-top:6px">${q.explanation}</div>
              </div>
            `;
          }).join('')}
        </div>
      </details>

      <div style="text-align:center">
        <button class="btn btn-primary btn-lg" onclick="onboardingState.step = 5; renderOnboardingStep();" style="padding:18px 48px;font-size:17px">
          Continue &rarr;
        </button>
      </div>
    </div>
  `;
}

function onboardingNext() {
  onboardingState.step++;
  renderOnboardingStep();
}

function onboardingStep2Submit() {
  const name = document.getElementById('obName').value.trim();
  const testDate = document.getElementById('obTestDate').value;

  if (name) onboardingState.name = name;
  if (testDate) onboardingState.testDate = testDate;

  onboardingState.step = 3;
  renderOnboardingStep();
}

async function skipOnboarding() {
  try {
    const user = await getUser();
    if (user) {
      await Store.updateProfile({ onboarding_complete: true });
    }
  } catch (err) {
    console.error('Failed to update profile:', err);
  }
  navigate('#/dashboard');
}
