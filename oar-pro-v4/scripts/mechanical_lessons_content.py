"""
mechanical_lessons_content.py -- OAR Pro v4
Comprehensive, lecture-style HTML content for 11 Mechanical Comprehension lessons.
Keys are lesson IDs (integers 7-17). Values are HTML strings ready for content_html column.

Usage:
    from mechanical_lessons_content import MECHANICAL_LESSONS
    html = MECHANICAL_LESSONS[7]  # Forces & Newton's Laws

LaTeX note:
    All lesson strings are raw strings (r"..."). Single backslashes are literal.
    MathJax reads \\[ ... \\] for display math and \\( ... \\) for inline math.
    When embedding into SQL via Python, escape each backslash: use .replace("\\", "\\\\").

-- Benjamin Rodriguez
"""

# Each value is a raw triple-quoted string so backslashes are literal (not escape sequences).
# This means \[ \( \frac \text etc. are passed exactly as MathJax expects.

MECHANICAL_LESSONS = {

# -------------------------------------------------------------------------
# LESSON 7 -- Forces & Newton's Laws
# -------------------------------------------------------------------------
7: r"""
<h1>Forces &amp; Newton's Laws</h1>
<p class="lesson-subtitle">Newton's three laws of motion are the backbone of mechanical comprehension -- master them and roughly half of all OAR mechanical questions become straightforward applications of the same core ideas.</p>

<h2>What Is a Force?</h2>
<p>Before we get to Newton, let's be precise about what a force actually is. A force is a push or a pull -- it's an interaction between two objects. Forces have two essential properties: magnitude (how strong) and direction (which way). That makes force a vector quantity, which matters a lot when multiple forces act on the same object at the same time. The net force -- the vector sum of all forces -- is what actually determines what happens to an object.</p>
<p>Forces are measured in Newtons (N). One Newton is defined as the force needed to accelerate a 1 kg mass at 1 m/s&sup2;. That's why the units work out: 1 N = 1 kg &middot; m/s&sup2;.</p>

<h2>Newton's First Law -- The Law of Inertia</h2>
<p>Here is the law in plain language: an object at rest stays at rest, and an object in motion stays in motion at constant velocity -- unless acted upon by a net external force. The key word is "net." If all forces cancel out, an object behaves as if there are no forces at all. This property of matter -- the tendency to resist changes in its state of motion -- is called inertia.</p>
<p>What makes inertia so counterintuitive is that we live in a world full of friction. On Earth, a rolling ball eventually stops, which makes it feel like objects naturally want to come to rest. But that's friction doing the stopping -- not some natural tendency. In space, with no friction, a thrown wrench drifts forever at constant velocity. That's the true behavior of matter left alone.</p>

<div class="callout callout-tip">
  <div class="callout-title">The Real-World Implication</div>
  Why do you lurch forward when a car brakes suddenly? Your body was moving at 60 mph and, per the first law, it wants to keep moving at 60 mph. The car stopped, but you didn't -- until the seatbelt applied a force to change your state of motion. Seatbelts, airbags, and crumple zones all exist because of inertia. Understanding the first law is understanding why safety equipment works.
</div>

<div class="example-box">
  <strong>OAR-Style Question:</strong> A hockey puck slides across frictionless ice. No one touches it. Describe its motion after 10 seconds.<br><br>
  <strong>Step 1:</strong> Identify all forces. No friction. No air resistance. Gravity is balanced by the normal force from the ice. Net force = 0.<br>
  <strong>Step 2:</strong> Apply the first law. Net force = 0 means no change in velocity.<br>
  <strong>Answer:</strong> The puck continues at the exact same speed and direction indefinitely. It does not slow down, speed up, or change direction.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Constant Velocity Means Zero Net Force</div>
  The OAR frequently shows an object moving at constant velocity and asks about the forces. Students often think "it's moving, so there must be a net force." Wrong. Constant velocity -- no change in speed or direction -- means the net force is exactly zero. The forces are balanced. An airplane cruising at 500 mph has a net force of zero: thrust exactly equals drag, lift exactly equals weight.
</div>

<h2>Newton's Second Law -- F = ma</h2>
<p>The first law told you what happens when net force is zero. The second law tells you what happens when it isn't. When a net force acts on an object, it accelerates. The relationship is direct and precise:</p>

<div class="formula-block">\[ F_{\text{net}} = m \times a \]</div>

<p>Read this equation carefully. F is the net force -- not just any force, but the vector sum of all forces acting on the object. Mass (m) is the object's resistance to acceleration -- its inertia. Acceleration (a) is the result. If you double the net force on the same object, you double its acceleration. If you double the mass while keeping the same force, you halve the acceleration. The law is elegant precisely because everything scales linearly.</p>

<div class="formula-block">\[ a = \frac{F}{m} \qquad m = \frac{F}{a} \qquad F = m \times a \]</div>

<div class="example-box">
  <strong>Worked Example 1:</strong> A 5 kg box on a frictionless surface is pushed with 30 N. What is its acceleration?<br><br>
  \( a = \frac{F}{m} = \frac{30 \text{ N}}{5 \text{ kg}} = 6 \text{ m/s}^2 \)<br><br>
  This means every second, the box gains 6 m/s of speed. After 1 s it moves at 6 m/s. After 3 s it moves at 18 m/s. The acceleration is constant as long as the force stays constant.
</div>

<div class="example-box">
  <strong>Worked Example 2 -- Net Force Problem:</strong> A 10 kg box is pushed right with 40 N. Friction pushes back with 15 N. What is the acceleration?<br><br>
  <strong>Step 1:</strong> Find net force. Forces are in opposite directions, so subtract.<br>
  \( F_{\text{net}} = 40 - 15 = 25 \text{ N (to the right)} \)<br><br>
  <strong>Step 2:</strong> Apply second law.<br>
  \( a = \frac{25}{10} = 2.5 \text{ m/s}^2 \text{ (to the right)} \)<br><br>
  Notice: we used net force, not the 40 N push alone. This is the most common mistake on the OAR.
</div>

<h3>Mass vs. Weight -- a Critical Distinction</h3>
<p>Mass is the amount of matter in an object. It is measured in kilograms and never changes regardless of where you are. Weight is the gravitational force acting on that mass. It changes depending on local gravity. Weight is calculated using F = ma with a = g (gravitational acceleration):</p>

<div class="formula-block">\[ W = m \times g \quad (g \approx 9.8 \text{ m/s}^2 \approx 10 \text{ m/s}^2 \text{ for OAR calculations}) \]</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Mass vs. Weight Confusion</div>
  "A 70 kg astronaut is on the Moon where gravity is 1.6 m/s&sup2;. What is their weight on the Moon?"<br>
  The trap: students confuse mass with weight and answer "70 kg." Wrong -- 70 kg is the mass, which doesn't change. Weight = 70 &times; 1.6 = 112 N on the Moon, versus 70 &times; 9.8 = 686 N on Earth. Mass is always in kg. Weight is always in Newtons.
</div>

<h2>Free Body Diagrams and Normal Force</h2>
<p>A free body diagram (FBD) is a sketch showing all forces acting on an object as arrows. Every OAR force problem becomes trivial once you draw the FBD correctly. The key forces to identify: applied force, weight (always straight down), normal force, friction, and tension (if ropes are involved).</p>
<p>Normal force is the force a surface exerts perpendicular to its surface on an object resting on it. On a flat surface, normal force equals the object's weight, because the object is in vertical equilibrium (not accelerating up or down). Normal force is not always equal to weight -- if you push down on a box, the normal force increases. If you pull up on it, it decreases. If you're in an accelerating elevator, it changes.</p>

<div class="example-box">
  <strong>Elevator Problem:</strong> A 60 kg person stands on a scale in an elevator accelerating upward at 2 m/s&sup2;.<br><br>
  <strong>Draw FBD:</strong> Normal force N (up) and weight W = 60 &times; 10 = 600 N (down). Net force is upward since the person accelerates upward.<br><br>
  \( F_{\text{net}} = N - W = ma \)<br>
  \( N - 600 = 60 \times 2 = 120 \)<br>
  \( N = 720 \text{ N} \)<br><br>
  The scale reads 720 N -- more than the person's normal weight. This is why you feel heavier when an elevator accelerates upward and lighter when it accelerates downward.
</div>

<h2>Newton's Third Law -- Action and Reaction</h2>
<p>For every action force, there is an equal and opposite reaction force. The critical nuance -- the one the OAR tests -- is that the two forces act on different objects. They never act on the same object, which means they cannot cancel each other out.</p>
<p>When you push a wall with 20 N, the wall pushes your hand back with 20 N. One force is on the wall, the other is on you. The wall doesn't move because the ground holds it in place. But if you were on a skateboard on a frictionless surface, you would roll backward -- because that 20 N reaction force has nothing to stop it from accelerating you.</p>

<div class="example-box">
  <strong>Identifying Action-Reaction Pairs:</strong><br><br>
  &bull; You walk: your foot pushes the ground backward (action) &rarr; ground pushes your foot forward (reaction)<br>
  &bull; A rocket fires: exhaust gases are pushed backward (action) &rarr; gases push the rocket forward (reaction)<br>
  &bull; Earth pulls you down with gravity (action) &rarr; you pull Earth up with equal gravity (reaction)<br><br>
  In every case, the forces are equal in magnitude, opposite in direction, and on different objects.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: "Don't action-reaction forces cancel?"</div>
  This is the most common third-law error. Students see "equal and opposite" and think the forces cancel, like +20 N and -20 N adding to zero. They don't cancel because cancellation requires two forces on the same object. Action-reaction pairs are always on different objects. They can never cancel.
</div>

<h2>Friction -- Static vs. Kinetic</h2>
<p>Friction is the force that opposes the sliding of two surfaces against each other. There are two types, and the OAR almost always tests the difference between them. Static friction acts when an object is not moving. Kinetic friction acts when an object is already sliding.</p>

<div class="formula-block">\[ f_s \leq \mu_s N \qquad f_k = \mu_k N \]</div>

<p>The coefficients of friction (\(\mu\)) depend on the surfaces involved. The key fact: static friction is always greater than or equal to kinetic friction for the same surfaces. It takes more force to start something moving than to keep it moving. Push a heavy dresser and you'll feel this -- that first budge is the hardest part. Once it's sliding, it gets easier.</p>

<div class="callout callout-tip">
  <div class="callout-title">OAR Strategy for Friction Questions</div>
  If the question asks "what is the minimum force to start moving the box?" -- use static friction. If the box is already sliding and asks for the force of friction -- use kinetic friction. The answer choices will be designed to trap you if you pick the wrong type.
</div>

<h2>Inclined Plane Force Decomposition</h2>
<p>When an object sits on a ramp, gravity still pulls straight down -- but the surface can only push perpendicular to itself. This means gravity has two components relative to the ramp: one along the ramp surface (pulling the object down the slope) and one perpendicular to it (pushing into the surface).</p>

<div class="formula-block">\[ F_{\parallel} = mg\sin\theta \qquad F_{\perp} = mg\cos\theta \]</div>

<div class="example-box">
  <strong>Ramp Problem:</strong> A 10 kg box sits on a 30&deg; frictionless ramp. What force accelerates it down the slope?<br><br>
  \( F_{\parallel} = mg\sin 30° = 10 \times 10 \times 0.5 = 50 \text{ N} \)<br><br>
  Using F = ma: \( a = F/m = 50/10 = 5 \text{ m/s}^2 \) down the slope.<br><br>
  Note: The normal force is \( N = mg\cos 30° = 10 \times 10 \times 0.866 \approx 87 \text{ N} \) -- less than the full weight of 100 N because part of gravity is directed along the slope, not into it.
</div>

<div class="callout callout-tip">
  <div class="callout-title">OAR Angle Shortcut</div>
  The OAR rarely asks you to compute sin/cos from scratch. More often, it asks conceptual questions: "As the ramp angle increases, does the force along the slope increase or decrease?" Answer: sin increases as angle increases (from 0 at flat to 1 at vertical), so the parallel force increases. At 0&deg;, the box doesn't slide. At 90&deg;, it's in free fall. This conceptual understanding beats memorizing trig tables every time.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 8 -- Levers & Torque
# -------------------------------------------------------------------------
8: r"""
<h1>Levers &amp; Torque</h1>
<p class="lesson-subtitle">Levers are the most tested simple machine on the OAR -- and once you truly understand torque, the three classes of levers become intuitively obvious rather than something to memorize.</p>

<h2>What Is Torque?</h2>
<p>Torque is the rotational equivalent of force. While a force causes linear acceleration (F = ma), torque causes angular acceleration -- it makes things spin or rotate. Every time you open a door, tighten a bolt, or use a wrench, you are applying torque. The mathematical definition is simple but profound:</p>

<div class="formula-block">\[ \tau = F \times d \]</div>

<p>Torque (tau, \(\tau\)) equals the force applied multiplied by the perpendicular distance from the pivot point (called the moment arm or lever arm). The units are Newton-meters (N&middot;m). The farther from the pivot you apply the force, the more torque you generate -- even with the same force. This is why a longer wrench makes loosening a stubborn bolt easier: same hand force, longer moment arm, more torque.</p>

<div class="example-box">
  <strong>Torque Comparison:</strong> You need to loosen a bolt that requires 60 N&middot;m of torque.<br><br>
  With a 0.3 m wrench: \( F = \tau / d = 60 / 0.3 = 200 \text{ N} \) -- a hard push.<br>
  With a 0.6 m wrench: \( F = 60 / 0.6 = 100 \text{ N} \) -- half the effort.<br>
  With a 1.0 m breaker bar: \( F = 60 / 1.0 = 60 \text{ N} \) -- easy.<br><br>
  Same torque goal, same bolt. Longer tool = less force required. This is the essence of mechanical advantage through torque.
</div>

<div class="callout callout-tip">
  <div class="callout-title">Why Doors Have Handles at the Edge</div>
  A door's hinge is the pivot point. The handle is placed as far from the hinge as possible to maximize the moment arm. Try pushing a door open right next to the hinge -- it's nearly impossible. Same door, same weight, but the moment arm is tiny, so the torque is tiny. Architects understand torque whether they know the formula or not.
</div>

<h2>Torque Balance -- The Lever Principle</h2>
<p>When a lever is in equilibrium (balanced, not rotating), the torques on each side of the fulcrum are equal and opposite. This gives us the fundamental lever equation:</p>

<div class="formula-block">\[ F_1 \times d_1 = F_2 \times d_2 \]</div>

<p>Force times distance on the left equals force times distance on the right. This equation is the foundation for solving every lever and seesaw problem on the OAR. Notice what it tells you: if one side has a longer arm, it needs less force to balance. Force and distance trade off -- always.</p>

<div class="example-box">
  <strong>Seesaw Balance Problem:</strong> A 40 kg child sits 3 m from the fulcrum. How far from the fulcrum must a 60 kg child sit to balance?<br><br>
  First, convert to forces (weights): \( F_1 = 40 \times 10 = 400 \text{ N} \), \( F_2 = 60 \times 10 = 600 \text{ N} \)<br><br>
  Set up: \( 400 \times 3 = 600 \times d_2 \)<br>
  \( 1200 = 600 \times d_2 \)<br>
  \( d_2 = 2 \text{ m} \)<br><br>
  The heavier child sits closer. Makes intuitive sense -- you've seen this on playgrounds. Physics just makes it precise.
</div>

<h2>The Three Classes of Levers</h2>
<p>Every lever has three elements: the fulcrum (pivot), the load (what you're moving), and the effort (what you're applying). The class of a lever is determined entirely by the arrangement of these three elements -- specifically, which one is in the middle.</p>
<p>The memory system: use the acronym FLE. The letter tells you what's in the middle for each class. First class = Fulcrum in middle. Second class = Load in middle. Third class = Effort in middle.</p>

<h3>Class 1 -- Fulcrum in the Middle</h3>
<p>The fulcrum sits between the effort and the load. Think: seesaw, crowbar, scissors, and pliers. The effort and load are on opposite sides of the fulcrum. Class 1 levers can have mechanical advantage greater than 1, equal to 1, or less than 1 depending on arm lengths. The crowbar's long effort arm gives it enormous mechanical advantage. Scissors have approximately equal arms so MA &asymp; 1.</p>

<div class="callout callout-tip">
  <div class="callout-title">Class 1 Memory Anchor: SEESAW</div>
  A seesaw has the pivot (fulcrum) dead center. One kid pushes down on one side (effort), the other kid rises on the other side (load). The fulcrum is between them. Every Class 1 lever looks like a seesaw -- same structure, different application.
</div>

<h3>Class 2 -- Load in the Middle</h3>
<p>The load sits between the fulcrum and the effort. Think: wheelbarrow, nutcracker, bottle opener, and door (hinge is fulcrum, your hand is effort, door weight is the load in between). Class 2 levers always have mechanical advantage greater than 1 -- they always multiply your force. You always move the effort end more than the load moves, but you always use less force than the load weight.</p>

<div class="callout callout-tip">
  <div class="callout-title">Class 2 Memory Anchor: WHEELBARROW</div>
  The wheel (fulcrum) is at one end. The load of dirt is in the middle of the barrow. You lift from the handles at the far end (effort). Load is between the fulcrum and your effort -- that's Class 2. Nutcracker: hinge is fulcrum, nut is in the middle, your hand squeezes at the far end.
</div>

<h3>Class 3 -- Effort in the Middle</h3>
<p>The effort is applied between the fulcrum and the load. Think: fishing rod, tweezers, broom, baseball bat, and your forearm (elbow is fulcrum, bicep pulls in middle, hand holds load). Class 3 levers always have mechanical advantage less than 1 -- they actually require more force than the load weight. Why use them? They provide speed and range of motion. Your forearm moves fast at the hand end even though the bicep only moves a short distance. Speed and range, not force multiplication.</p>

<div class="callout callout-tip">
  <div class="callout-title">Class 3 Memory Anchor: FISHING ROD</div>
  Hold the rod butt with one hand (fulcrum). Your other hand grips near the middle (effort). The fish hangs from the tip (load). Effort is between fulcrum and load -- Class 3. Your forearm works identically: elbow = fulcrum, bicep muscle attachment = effort, hand = load.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Which Element Is in the Middle?</div>
  The OAR will describe a lever scenario and ask which class it is. The trap is confusing the arrangement. Always ask yourself: of the three elements (fulcrum, load, effort), which one is in the middle? That's the class. Draw it out if needed -- Class 1: F in middle (E--F--L or L--F--E). Class 2: L in middle (F--L--E). Class 3: E in middle (F--E--L).
</div>

<h2>Mechanical Advantage</h2>
<p>Mechanical advantage (MA) quantifies how much a lever multiplies your force. An MA of 4 means you only need 1/4 the force to move the load -- but you must push 4 times farther. MA is always the effort arm divided by the load arm:</p>

<div class="formula-block">\[ MA = \frac{\text{Effort Arm Length}}{\text{Load Arm Length}} \]</div>

<div class="example-box">
  <strong>MA Calculation:</strong> A lever has an effort arm of 8 ft and a load arm of 2 ft. A 400 lb rock needs to be lifted.<br><br>
  \( MA = 8/2 = 4 \)<br>
  \( \text{Effort required} = \text{Load} / MA = 400 / 4 = 100 \text{ lbs} \)<br><br>
  You need only 100 lbs to lift a 400 lb rock. But your effort hand must move 4 times farther than the rock moves. If the rock rises 1 foot, your hand moved 4 feet. Force trades for distance -- always.
</div>

<div class="callout callout-warning">
  <div class="callout-title">The Conservation Trap: Simple Machines Save No Work</div>
  Students sometimes think levers reduce the total work done. They don't. Work = Force &times; Distance. A lever with MA = 4 uses 1/4 the force but requires 4 times the distance. Work in = Work out (in an ideal, frictionless lever). The OAR may ask: "Does a lever reduce the total work required?" The answer is no -- it only redistributes how that work is done. Less force, more distance. Always.
</div>

<div class="callout callout-tip">
  <div class="callout-title">When MA &gt; 1 vs MA &lt; 1</div>
  MA &gt; 1: effort arm is longer than load arm &rarr; force is multiplied (crowbar, wheelbarrow). You trade distance for force.<br>
  MA = 1: arms are equal &rarr; no mechanical advantage (just redirection of force).<br>
  MA &lt; 1: effort arm is shorter than load arm &rarr; force is reduced, but speed and range increase (Class 3 levers, tweezers). You trade force for speed. The OAR tests both directions.
</div>

<div class="example-box">
  <strong>OAR Practice Set:</strong><br><br>
  <strong>Q1:</strong> A crowbar is 120 cm long. The fulcrum is 20 cm from the load. What is the MA?<br>
  Effort arm = 120 - 20 = 100 cm. Load arm = 20 cm. \( MA = 100/20 = 5 \). Load requires 1/5 the weight in effort.<br><br>
  <strong>Q2:</strong> A seesaw has a 30 kg child 2 m left of center and a 20 kg child on the right. How far right must the lighter child sit to balance?<br>
  \( 30 \times 2 = 20 \times d \) &rarr; \( d = 60/20 = 3 \text{ m} \). Lighter child sits farther away.<br><br>
  <strong>Q3:</strong> Your forearm (Class 3 lever) has your elbow as fulcrum, bicep attached 4 cm from elbow, and you hold a weight 35 cm from elbow. What is the MA?<br>
  \( MA = 4/35 \approx 0.11 \). MA &lt; 1 -- you need MORE muscle force than the weight you're holding. Your bicep must exert about 9&times; the weight of what you're holding. This is why heavy lifting is hard even for strong muscles.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 9 -- Gears & Pulleys
# -------------------------------------------------------------------------
9: r"""
<h1>Gears &amp; Pulleys</h1>
<p class="lesson-subtitle">Gears and pulleys are the OAR's most visual mechanical questions -- and they follow three simple rules that, once internalized, make every gear and pulley diagram a guaranteed correct answer.</p>

<h2>How Gears Work -- The Core Concept</h2>
<p>Gears are interlocking toothed wheels that transmit rotation and torque from one shaft to another. Because the teeth mesh directly, you can predict exactly how fast each gear rotates and in which direction it turns. The teeth that mesh together move at the same linear speed -- that's the key physical constraint that makes the math work.</p>
<p>The fundamental relationship: if two gears mesh, the product of teeth count and RPM is the same for both gears. This is because both gears' teeth pass through the contact point at the same rate.</p>

<div class="formula-block">\[ T_1 \times RPM_1 = T_2 \times RPM_2 \]</div>

<p>Where T = number of teeth (or you can use radius -- same math, since more teeth = larger radius). This equation immediately tells you: if the driven gear has more teeth, it rotates slower. If it has fewer teeth, it rotates faster. The driver and driven gears trade speed for torque.</p>

<h2>Gear Ratio</h2>
<p>Gear ratio is typically expressed as driven &divide; driver (output &divide; input). It tells you how the output relates to the input:</p>

<div class="formula-block">\[ \text{Gear Ratio} = \frac{T_{\text{driven}}}{T_{\text{driver}}} = \frac{RPM_{\text{driver}}}{RPM_{\text{driven}}} \]</div>

<div class="example-box">
  <strong>Speed Calculation:</strong> Gear A (driver) has 20 teeth and spins at 300 RPM. It meshes with Gear B (driven) which has 60 teeth. How fast does Gear B spin?<br><br>
  Using \( T_1 \times RPM_1 = T_2 \times RPM_2 \):<br>
  \( 20 \times 300 = 60 \times RPM_B \)<br>
  \( RPM_B = 6000/60 = 100 \text{ RPM} \)<br><br>
  Gear ratio = 60/20 = 3:1. The driven gear is 3&times; larger, so it spins 3&times; slower. And critically -- it produces 3&times; the torque. Speed went down, torque went up. This is how a car's transmission works: low gear = high torque, low speed. High gear = low torque, high speed.
</div>

<div class="callout callout-tip">
  <div class="callout-title">The Speed-Torque Trade-Off</div>
  Large gear drives small gear &rarr; output is faster, less torque. (Like shifting to high gear on a bicycle -- easy to pedal fast, but hard to climb hills.)<br>
  Small gear drives large gear &rarr; output is slower, more torque. (Low gear on a bicycle -- hard to pedal fast, but easy to climb hills.)<br>
  This trade-off is universal across all simple machines. You never get something for nothing.
</div>

<h2>Direction of Rotation -- Meshed Gears</h2>
<p>This is where most students lose points on the OAR. The direction rule for meshed (directly touching) gears is absolute: adjacent gears always rotate in opposite directions. When the top of gear A moves right, the teeth of gear B at that contact point are pushed left -- so gear B rotates the other way.</p>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Direction Rules for Gear Chains</div>
  For a chain of meshed gears (each touching the next):<br><br>
  &bull; Adjacent gears always rotate in OPPOSITE directions.<br>
  &bull; Gears one apart (non-adjacent) rotate in the SAME direction as the first.<br>
  &bull; The pattern alternates: CW, CCW, CW, CCW...<br><br>
  Quick rule: Count from the driver gear. Odd-numbered position = same direction as driver. Even-numbered = opposite direction. So in a 5-gear chain, gear 1 (driver) and gear 5 spin the same direction. Gear 4 spins opposite.
</div>

<div class="example-box">
  <strong>Direction Problem:</strong> Gear A turns clockwise. It meshes with Gear B, which meshes with Gear C, which meshes with Gear D.<br><br>
  A: clockwise (position 1 -- driver)<br>
  B: counterclockwise (position 2 -- opposite A)<br>
  C: clockwise (position 3 -- same as A)<br>
  D: counterclockwise (position 4 -- opposite A)<br><br>
  Four gears. Driver is CW. Last gear (position 4, even) is CCW.
</div>

<h2>Chain and Belt Drives -- Direction Exception</h2>
<p>When gears are connected by a chain (like a bicycle) or a belt (like a car engine), the direction rules change completely. A chain or belt carries the rotation across without reversing it. Both sprockets rotate in the same direction. This is the critical exception that the OAR loves to test.</p>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Chain/Belt vs. Meshed Gears</div>
  Meshed (direct contact): adjacent gears go OPPOSITE directions.<br>
  Chain/belt connected: both gears go the SAME direction.<br><br>
  If you see a chain in the diagram -- same direction. If teeth mesh directly -- opposite direction. The OAR will make you distinguish between these two scenarios in the same question set.
</div>

<div class="example-box">
  <strong>Gear Train Problem:</strong> Three gears in series: A(10 teeth) &rarr; B(40 teeth) &rarr; C(20 teeth). Gear A is the driver at 800 RPM clockwise. Find C's speed and direction.<br><br>
  Step 1: A to B. \( 10 \times 800 = 40 \times RPM_B \) &rarr; \( RPM_B = 200 \text{ RPM} \). B is counterclockwise (opposite A).<br>
  Step 2: B to C. \( 40 \times 200 = 20 \times RPM_C \) &rarr; \( RPM_C = 400 \text{ RPM} \). C is clockwise (opposite B, same as A).<br><br>
  Final answer: C spins at 400 RPM clockwise.
</div>

<h2>Pulley Systems</h2>
<p>Pulleys change the direction or magnitude of a force. A rope over a pulley wheel redirects where you pull without changing how much force you apply -- unless the pulley system is set up in a specific way to create mechanical advantage.</p>

<h3>Fixed Pulley</h3>
<p>A fixed pulley is attached to a fixed point (like a ceiling). The rope runs over it. You pull down, the load goes up. The direction changes, but the force does not. You must pull with the full weight of the load. MA = 1. Fixed pulleys are about convenience -- they let you use your body weight to lift instead of lifting directly overhead.</p>

<h3>Movable Pulley</h3>
<p>A movable pulley is attached to the load itself. The load hangs from the pulley, and two rope segments support the pulley's weight. Since two segments share the load, each only carries half the weight. You pull with half the force needed to lift the load directly. MA = 2. The catch: you must pull the rope twice as far as the load rises.</p>

<h3>Compound Pulley (Block and Tackle)</h3>
<p>A compound system combines fixed and movable pulleys. The ideal mechanical advantage equals the number of rope segments that directly support the load. Count the ropes attached to (or passing under) the movable pulley -- that number is your IMA.</p>

<div class="formula-block">\[ IMA = \text{number of rope segments supporting the load} \]</div>

<div class="example-box">
  <strong>Compound Pulley Problem:</strong> A block-and-tackle system has 4 rope segments supporting a 600 N load. How much force must you apply?<br><br>
  \( IMA = 4 \), so \( F_{\text{effort}} = \text{Load} / IMA = 600 / 4 = 150 \text{ N} \)<br><br>
  You lift a 600 N weight with only 150 N of force. But you must pull the rope 4 times as far as the load rises. If the load needs to go up 1 meter, you pull 4 meters of rope.
</div>

<div class="callout callout-tip">
  <div class="callout-title">Counting Rope Segments -- The OAR Method</div>
  The easiest way to find pulley IMA on the OAR: look at the movable pulley (the one attached to the load) and count every rope segment that touches or connects to it. Each segment supports an equal share of the load. That count is your IMA. Don't overthink it -- just count the supporting ropes.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Fixed Pulleys Don't Reduce Force</div>
  A common wrong answer: "a single pulley halves the force required." Only a movable pulley (or one where the rope has two segments supporting the load) halves the force. A single fixed pulley changes direction only. MA = 1. If you see one pulley attached to the ceiling with one rope -- full load force required.
</div>

<div class="example-box">
  <strong>OAR Practice Set:</strong><br><br>
  <strong>Q1:</strong> Gear A has 15 teeth at 240 RPM. Gear B has 60 teeth. What is B's RPM?<br>
  \( 15 \times 240 = 60 \times RPM_B \) &rarr; \( RPM_B = 60 \text{ RPM} \). B is 4&times; larger, spins 4&times; slower.<br><br>
  <strong>Q2:</strong> In a 6-gear chain starting with CW, what direction does the last gear turn?<br>
  Position 6 is even &rarr; opposite the driver &rarr; counterclockwise.<br><br>
  <strong>Q3:</strong> A block-and-tackle has 3 rope segments supporting a 900 N load. What effort is needed?<br>
  \( F = 900/3 = 300 \text{ N} \). The rope must be pulled 3&times; the load's rise distance.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 10 -- Energy, Work & Power
# -------------------------------------------------------------------------
10: r"""
<h1>Energy, Work &amp; Power</h1>
<p class="lesson-subtitle">Work, energy, and power are three of the most connected concepts in physics -- understanding how they relate to each other is what separates students who guess from students who solve OAR mechanical questions in 30 seconds.</p>

<h2>Work -- What It Actually Means</h2>
<p>In physics, work has a precise definition that differs from its everyday meaning. Work is done on an object when a force causes it to move through a displacement. The critical qualifier: only the component of force in the direction of motion counts. Force perpendicular to motion does zero work.</p>

<div class="formula-block">\[ W = F \times d \times \cos\theta \]</div>

<p>Where \(\theta\) is the angle between the force vector and the displacement vector. When force is parallel to motion (\(\theta = 0\)), \(\cos 0 = 1\) and \(W = Fd\). When force is perpendicular (\(\theta = 90°\)), \(\cos 90° = 0\) and \(W = 0\). Work is measured in Joules (J). One Joule = one Newton-meter.</p>

<div class="example-box">
  <strong>The Carrying Example (Zero Work):</strong> You carry a 20 kg box across a 10 m room at constant height.<br><br>
  Your upward force = 200 N (supporting the weight). Displacement = 10 m (horizontal). The angle between your upward force and horizontal motion = 90&deg;.<br>
  \( W = F \times d \times \cos 90° = 200 \times 10 \times 0 = 0 \text{ J} \)<br><br>
  You exerted force, you moved, but you did zero work on the box in the physics sense. This is counterintuitive but correct. The only work done was during initial lifting (vertical force, vertical displacement). Horizontal carrying at constant height = zero work on the box.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Zero Work Scenarios</div>
  The OAR loves asking about these zero-work situations: (1) pushing a wall that doesn't move -- force applied, zero displacement, so W = 0. (2) A ball swinging on a string -- tension is always perpendicular to velocity, so the string does zero work even though it's constantly applying force. (3) Carrying something horizontally at constant height -- as shown above. Work requires both force AND displacement in the same direction.
</div>

<h2>Kinetic Energy</h2>
<p>Kinetic energy is the energy of motion -- how much energy an object has by virtue of moving. Every moving object has it, and to stop that object, you must do work on it to remove all that kinetic energy.</p>

<div class="formula-block">\[ KE = \frac{1}{2}mv^2 \]</div>

<p>The velocity is squared. This is enormously important in practice. Double the speed, and kinetic energy quadruples. A car at 60 mph has four times the kinetic energy as at 30 mph -- not twice. Stopping distance scales the same way. This is why highway crashes are so much more devastating than parking lot bumps.</p>

<div class="example-box">
  <strong>KE Comparison:</strong> Two cars: Car A weighs 1000 kg at 20 m/s. Car B weighs 2000 kg at 10 m/s.<br><br>
  \( KE_A = \frac{1}{2}(1000)(20^2) = \frac{1}{2}(1000)(400) = 200{,}000 \text{ J} \)<br>
  \( KE_B = \frac{1}{2}(2000)(10^2) = \frac{1}{2}(2000)(100) = 100{,}000 \text{ J} \)<br><br>
  Car A has twice the kinetic energy despite being half the mass, because speed is squared. Speed matters more than mass for kinetic energy.
</div>

<h2>Gravitational Potential Energy</h2>
<p>Potential energy is stored energy -- energy that could be released as kinetic energy. Gravitational potential energy depends on height above some reference point (usually the ground). The higher an object is, the more potential energy it has relative to the ground.</p>

<div class="formula-block">\[ PE = mgh \]</div>

<div class="example-box">
  <strong>PE Calculation:</strong> A 5 kg ball is lifted to a height of 8 m. What is its gravitational PE?<br><br>
  \( PE = 5 \times 10 \times 8 = 400 \text{ J} \)<br><br>
  This 400 J of stored energy will all become kinetic energy if the ball is dropped -- as it falls, PE converts to KE.
</div>

<h2>Conservation of Energy -- The Roller Coaster</h2>
<p>In an ideal system with no friction or air resistance, total mechanical energy is conserved: the sum of KE and PE stays constant. Energy doesn't disappear -- it transforms. When a roller coaster climbs a hill, it slows down (KE decreases) while gaining height (PE increases). At the top, PE is maximum and KE may be minimum. As it descends, PE converts back to KE and it speeds up.</p>

<div class="formula-block">\[ KE_1 + PE_1 = KE_2 + PE_2 \]</div>
<div class="formula-block">\[ \frac{1}{2}mv_1^2 + mgh_1 = \frac{1}{2}mv_2^2 + mgh_2 \]</div>

<div class="example-box">
  <strong>Roller Coaster Problem:</strong> A 500 kg roller coaster car starts from rest at the top of a 20 m hill. What is its speed at the bottom? (Ignore friction, use g = 10 m/s&sup2;)<br><br>
  At top: \( KE_1 = 0 \), \( PE_1 = mgh = 500 \times 10 \times 20 = 100{,}000 \text{ J} \)<br>
  At bottom: \( PE_2 = 0 \), so all energy is kinetic.<br>
  \( \frac{1}{2}mv^2 = 100{,}000 \)<br>
  \( v^2 = \frac{200{,}000}{500} = 400 \)<br>
  \( v = 20 \text{ m/s} \)<br><br>
  Key insight: mass cancelled out. Any object dropped from 20 m reaches 20 m/s at the bottom, regardless of mass -- just like free fall.
</div>

<div class="callout callout-tip">
  <div class="callout-title">The Midpoint Question</div>
  OAR questions often ask about energy at an intermediate point. At half the height (10 m), the PE is half of total energy: 50,000 J. The other 50,000 J is kinetic. Set \( \frac{1}{2}mv^2 = 50{,}000 \) and solve: \( v = \sqrt{200} \approx 14.1 \text{ m/s} \). The speed at the halfway point is NOT half the final speed -- because KE goes as v&sup2;, the speed at half height is about 70% of the final speed.
</div>

<h2>Power -- Rate of Work</h2>
<p>Power is how quickly work is done. Two workers who move the same load to the same height do the same amount of work -- but the one who does it faster uses more power. Power is the rate of energy transfer.</p>

<div class="formula-block">\[ P = \frac{W}{t} = \frac{F \times d}{t} = F \times v \]</div>

<p>Power is measured in Watts (W). 1 Watt = 1 Joule per second. For context: a typical human can sustain about 100 W of continuous output. A car engine produces 100,000+ W (100+ kW). The old unit is horsepower: 1 hp &asymp; 746 W.</p>

<div class="example-box">
  <strong>Power Problem:</strong> A 70 kg person climbs a 4 m staircase in 3 seconds. What power do they generate?<br><br>
  Work done against gravity: \( W = mgh = 70 \times 10 \times 4 = 2800 \text{ J} \)<br>
  Power: \( P = W/t = 2800/3 \approx 933 \text{ W} \)<br><br>
  That's about 1.25 horsepower -- impressive short burst, but humans can't sustain that for long.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Power Is Rate, Not Total</div>
  "Machine A does 1000 J of work in 5 seconds. Machine B does 1000 J in 10 seconds. Which is more powerful?"<br>
  Both did the same work, but A did it twice as fast. Power = 1000/5 = 200 W (A) vs. 1000/10 = 100 W (B). Machine A is twice as powerful. Power is about time -- a powerful machine is fast, not necessarily one that does more total work.
</div>

<h2>Simple Machines and the Work Principle</h2>
<p>This is one of the most important conceptual points on the OAR: simple machines (levers, pulleys, ramps, screws, wedges, wheels) do not save work. They cannot. They trade force for distance. The work input equals the work output in an ideal (frictionless) machine.</p>

<div class="example-box">
  <strong>Ramp vs. Direct Lift:</strong> You need to raise a 500 N box 2 meters vertically.<br><br>
  Direct lift: \( W = 500 \times 2 = 1000 \text{ J} \). You apply 500 N.<br><br>
  Using a 10 m ramp (MA = 10/2 = 5): You apply \( 500/5 = 100 \text{ N} \), but you push the box 10 m along the ramp.<br>
  Work via ramp: \( W = 100 \times 10 = 1000 \text{ J} \). Same work!<br><br>
  The ramp didn't save you any energy. It just let you use less force over a longer distance. This is the golden rule of simple machines: work in = work out (ignoring friction).
</div>

<div class="callout callout-tip">
  <div class="callout-title">Efficiency -- When Friction Exists</div>
  Real machines have friction, so work output is always less than work input. Efficiency = (work output / work input) &times; 100%. A machine that's 80% efficient outputs 800 J for every 1000 J of input -- 200 J is lost to heat. The OAR rarely requires calculating efficiency, but you should know that friction always reduces it below 100%.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 11 -- Fluids & Pressure
# -------------------------------------------------------------------------
11: r"""
<h1>Fluids &amp; Pressure</h1>
<p class="lesson-subtitle">Fluid mechanics explains hydraulic systems, ship buoyancy, and why a sharp knife cuts better than a dull one -- all from one core equation and a few elegant principles.</p>

<h2>Pressure -- Force Over Area</h2>
<p>Pressure is force distributed over an area. The same force applied over a smaller area creates more pressure; spread over a larger area, it creates less pressure. This is why a sharp knife blade cuts through food easily but a butter knife doesn't -- the sharp edge concentrates all the force onto a tiny area, creating enormous local pressure.</p>

<div class="formula-block">\[ P = \frac{F}{A} \]</div>

<p>Pressure is measured in Pascals (Pa), where 1 Pa = 1 N/m&sup2;. You also see atmospheres (atm), where 1 atm &asymp; 101,325 Pa -- roughly the air pressure at sea level.</p>

<div class="example-box">
  <strong>Pressure Example:</strong> A 600 N force is applied to a 0.03 m&sup2; piston.<br><br>
  \( P = 600 / 0.03 = 20{,}000 \text{ Pa} \)<br><br>
  Now the same 600 N is applied to a piston with area 0.01 m&sup2;:<br>
  \( P = 600 / 0.01 = 60{,}000 \text{ Pa} \)<br><br>
  Same force, one-third the area &rarr; three times the pressure. This principle explains stiletto heels sinking into soft floors (tiny area, huge pressure) versus snow shoes distributing weight over a large area.
</div>

<div class="callout callout-tip">
  <div class="callout-title">Sharp Blade Intuition</div>
  A kitchen knife exerts perhaps 20 N of downward force. A sharp blade with an edge area of 0.00001 m&sup2; creates P = 20 / 0.00001 = 2,000,000 Pa. A dull blade with 100&times; the edge area creates only 20,000 Pa. The sharp blade creates 100&times; more pressure from identical force. This is why sharpness matters -- not more force, but the same force on a much smaller area.
</div>

<h2>Pressure in Fluids -- Depth Dependence</h2>
<p>In a static fluid (not moving), pressure increases with depth. Every meter deeper in water adds about 9,800 Pa (roughly 0.1 atm) of pressure. A diver at 10 m depth experiences roughly double the surface pressure. At 100 m, about 11 atm. This is why submarines and deep-sea equipment must withstand enormous pressures -- the water above exerts its full weight on everything below.</p>

<div class="formula-block">\[ P = P_0 + \rho g h \]</div>

<p>Where \(P_0\) is surface pressure, \(\rho\) (rho) is fluid density, g is gravitational acceleration, and h is depth. For water: \(\rho = 1000 \text{ kg/m}^3\). Importantly, fluid pressure at a given depth acts equally in all directions -- this is why underwater objects feel pressure from all sides, not just from above.</p>

<h2>Pascal's Law -- Hydraulic Machines</h2>
<p>Pascal's Law states that pressure applied to an enclosed fluid is transmitted equally throughout the fluid in all directions. This is the foundational principle behind every hydraulic system -- car brakes, hydraulic lifts, excavator arms, and dental chairs. The elegance of Pascal's law is that it lets a small force create a much larger force by changing piston areas.</p>

<div class="formula-block">\[ \frac{F_1}{A_1} = \frac{F_2}{A_2} \quad \Rightarrow \quad F_2 = F_1 \times \frac{A_2}{A_1} \]</div>

<div class="example-box">
  <strong>Hydraulic Lift Problem:</strong> A mechanic applies 200 N to a small piston with area 0.01 m&sup2;. The large piston has area 0.25 m&sup2;. What force does the large piston exert?<br><br>
  Pressure transmitted: \( P = 200 / 0.01 = 20{,}000 \text{ Pa} \)<br>
  Force at large piston: \( F_2 = P \times A_2 = 20{,}000 \times 0.25 = 5{,}000 \text{ N} \)<br><br>
  Or directly: \( F_2 = F_1 \times (A_2/A_1) = 200 \times 25 = 5{,}000 \text{ N} \)<br><br>
  The small piston's 200 N (about 45 lbs of force) lifts 5,000 N (about 1,100 lbs). This is how a mechanic using a hand pump lifts a 2-ton car.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Pressure Is Transmitted, Not Multiplied</div>
  Larger piston = larger FORCE output, not larger PRESSURE output. The pressure is the same throughout the fluid (Pascal's law). What changes is the force, because force = pressure &times; area. The OAR will sometimes ask "which piston has more pressure?" Both pistons have identical pressure. The bigger one has more force -- not more pressure.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: The Conservation Rule for Hydraulics</div>
  Just like levers, hydraulic machines don't create energy. If the large piston exerts 25&times; more force, the small piston must move 25&times; farther. To lift the car 1 cm, you pump the small piston 25 cm. Volume displaced is conserved: \( A_1 \times d_1 = A_2 \times d_2 \). Work in = work out (ideal system).
</div>

<h2>Archimedes' Principle -- Buoyancy</h2>
<p>Archimedes' principle states: the buoyant force on an object submerged in a fluid equals the weight of the fluid displaced by the object. This is why things float -- if the weight of displaced fluid equals or exceeds the object's weight, the buoyant force is enough to support it.</p>

<div class="formula-block">\[ F_b = \rho_{\text{fluid}} \times g \times V_{\text{displaced}} \]</div>

<p>An object floats when \(F_b \geq W_{\text{object}}\), which means \(\rho_{\text{object}} \leq \rho_{\text{fluid}}\). Dense objects sink; less dense objects float. But shape matters for composite objects -- a solid steel ball sinks, but a hollow steel ship floats because the ship's average density (steel + trapped air) is less than water.</p>

<div class="example-box">
  <strong>Why Ships Float:</strong> An aircraft carrier weighs about 100,000 tons. How does it float?<br><br>
  The ship's hull is shaped to displace an enormous volume of water. That displaced water volume has a weight equal to the ship's weight. When the hull displaces 100,000 tons of water, the buoyant force equals 100,000 tons upward -- exactly balancing the ship's weight.<br><br>
  The key: the ship's average density across its entire volume (steel hull + internal air spaces) is less than seawater's density of about 1025 kg/m&sup3;. If you melted the ship into a solid steel block, it would sink instantly. Shape is everything for buoyancy.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Size Alone Doesn't Determine Floating</div>
  "A large block of steel and a small piece of wood are placed in water. Which floats?" The answer is the wood -- not because of size, but because of density. Steel (density about 7800 kg/m&sup3;) is denser than water (1000 kg/m&sup3;) regardless of size. Wood (density about 500 kg/m&sup3;) is less dense than water regardless of size. Density, not size, determines whether an object sinks or floats in a given fluid.
</div>

<h2>Gauge Pressure vs. Absolute Pressure</h2>
<p>Absolute pressure is the total pressure at a point, including atmospheric pressure. Gauge pressure is the pressure above atmospheric -- what your car tire gauge measures. Your tire doesn't show 0 when flat; it shows 0 gauge pressure, meaning the absolute pressure equals atmospheric (about 101 kPa). Typical tire pressure might be 35 psi gauge pressure, meaning 35 psi above atmospheric.</p>

<div class="formula-block">\[ P_{\text{absolute}} = P_{\text{gauge}} + P_{\text{atmospheric}} \]</div>

<div class="callout callout-tip">
  <div class="callout-title">OAR Application: Pressure at Depth</div>
  A diver at 10 m depth: gauge pressure from the water column = \(\rho g h = 1000 \times 10 \times 10 = 100{,}000 \text{ Pa}\). Absolute pressure = 100,000 + 101,325 = 201,325 Pa &asymp; 2 atm. The diver experiences twice the surface atmospheric pressure. At 20 m: 3 atm. Gauge pressure tells you the extra pressure beyond atmosphere; absolute pressure tells you the total pressure the body experiences.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 12 -- Electricity Basics
# -------------------------------------------------------------------------
12: r"""
<h1>Electricity Basics</h1>
<p class="lesson-subtitle">Ohm's law, series and parallel circuits, and electrical power -- these four concepts cover virtually every electricity question on the OAR, and they're all connected through one unifying idea: charge flowing through resistance.</p>

<h2>The Water Pipe Analogy -- Building Intuition</h2>
<p>Before equations, let's build intuition. Think of electrical current like water flowing through pipes. Voltage is the water pressure -- the "push" that drives flow. Current is the flow rate -- how much water (charge) passes a point per second. Resistance is the narrowness of the pipe -- it restricts flow. With this picture, Ohm's law makes immediate sense: more pressure (voltage) drives more flow (current); a narrower pipe (more resistance) reduces flow.</p>

<h2>Ohm's Law</h2>
<p>The relationship between voltage, current, and resistance in a conductor is one of the most fundamental in all of physics. For most conductors at constant temperature, the ratio of voltage to current is constant -- that constant is resistance.</p>

<div class="formula-block">\[ V = I \times R \]</div>

<p>V = voltage in Volts (V). I = current in Amperes or Amps (A). R = resistance in Ohms (&Omega;). Rearranging: \(I = V/R\) (more voltage &rarr; more current; more resistance &rarr; less current). \(R = V/I\) (used to calculate resistance from measurements).</p>

<div class="example-box">
  <strong>Ohm's Law Examples:</strong><br><br>
  <strong>Find current:</strong> 9V battery, 3 &Omega; resistor.<br>
  \( I = V/R = 9/3 = 3 \text{ A} \)<br><br>
  <strong>Find resistance:</strong> 12V source drives 0.5 A of current.<br>
  \( R = V/I = 12/0.5 = 24 \text{ }\Omega \)<br><br>
  <strong>Find voltage drop:</strong> 4 A flows through an 8 &Omega; resistor.<br>
  \( V = IR = 4 \times 8 = 32 \text{ V} \)
</div>

<h2>Series Circuits</h2>
<p>In a series circuit, all components are connected end-to-end in a single loop. There is only one path for current to flow. Like water in a single pipe with several narrow sections -- the same amount of water passes each narrow section per second. The critical property: current is the same everywhere in a series circuit.</p>

<div class="formula-block">\[ R_{\text{total}} = R_1 + R_2 + R_3 + \cdots \]</div>
<div class="formula-block">\[ I_{\text{same throughout}} \qquad V_{\text{total}} = V_1 + V_2 + V_3 \]</div>

<div class="example-box">
  <strong>Series Circuit Analysis:</strong> Three resistors -- 4 &Omega;, 6 &Omega;, and 10 &Omega; -- connected in series to a 40V battery.<br><br>
  Step 1: Total resistance. \( R_{\text{total}} = 4 + 6 + 10 = 20 \text{ }\Omega \)<br>
  Step 2: Total current. \( I = V/R = 40/20 = 2 \text{ A} \) (same through all resistors)<br>
  Step 3: Voltage across each resistor. \( V_1 = 2 \times 4 = 8 \text{ V} \), \( V_2 = 2 \times 6 = 12 \text{ V} \), \( V_3 = 2 \times 10 = 20 \text{ V} \)<br>
  Check: \( 8 + 12 + 20 = 40 \text{ V} \) &#x2713;<br><br>
  Notice: larger resistors have larger voltage drops (V = IR). The resistor with the most resistance takes the most voltage.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Series Resistors Divide Voltage, Not Current</div>
  In a series circuit, current is the same everywhere -- it doesn't divide at the resistors. What divides (proportionally to resistance) is voltage. Students often think "3 resistors in series, so each gets 1/3 the current." Wrong. Each gets the full current but only a fraction of the voltage proportional to its resistance.
</div>

<h2>Parallel Circuits</h2>
<p>In a parallel circuit, components are connected across the same two nodes -- multiple paths exist for current. Like a river splitting into several channels. Each channel carries some portion of the total current, but the water level (voltage) in each channel is the same. The critical property: voltage is the same across all branches in a parallel circuit.</p>

<div class="formula-block">\[ \frac{1}{R_{\text{total}}} = \frac{1}{R_1} + \frac{1}{R_2} + \frac{1}{R_3} + \cdots \]</div>
<div class="formula-block">\[ V_{\text{same across all branches}} \qquad I_{\text{total}} = I_1 + I_2 + I_3 \]</div>

<div class="example-box">
  <strong>Parallel Circuit Analysis:</strong> Two resistors -- 6 &Omega; and 12 &Omega; -- in parallel across a 12V battery.<br><br>
  Step 1: Total resistance. \( \frac{1}{R} = \frac{1}{6} + \frac{1}{12} = \frac{2}{12} + \frac{1}{12} = \frac{3}{12} \) &rarr; \( R = 4 \text{ }\Omega \)<br>
  Step 2: Total current. \( I_{\text{total}} = 12/4 = 3 \text{ A} \)<br>
  Step 3: Current in each branch. \( I_1 = 12/6 = 2 \text{ A} \), \( I_2 = 12/12 = 1 \text{ A} \)<br>
  Check: \( 2 + 1 = 3 \text{ A} \) &#x2713;<br><br>
  Notice: total resistance (4 &Omega;) is less than either individual resistor. Adding more parallel paths always reduces total resistance.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Adding Parallel Resistors DECREASES Total Resistance</div>
  This is the most tested parallel circuit concept. Students think adding a resistor always increases resistance. In series, yes. In parallel, no -- adding another path gives current more routes, so total resistance always decreases. Every parallel resistor you add makes the total resistance go down. The total is always less than the smallest individual resistor.
</div>

<div class="callout callout-tip">
  <div class="callout-title">Two Equal Parallel Resistors -- Quick Formula</div>
  For exactly two equal resistors R in parallel: \( R_{\text{total}} = R/2 \). Three equal: \( R/3 \). In general, N equal resistors in parallel: \( R/N \). This shortcut solves half of all parallel resistance questions in 5 seconds.
</div>

<h2>Why Homes Use Parallel Wiring</h2>
<p>Every electrical outlet in your home is wired in parallel with all the others -- they all connect between the same two lines (the "hot" and "neutral"). This means every device gets the full 120V regardless of what else is plugged in, and one device failing or being turned off doesn't affect the others. Series wiring would be a disaster: one broken bulb would kill all the lights on the circuit (old string Christmas lights). Parallel wiring is resilient and universal in building electrical systems.</p>

<h2>Electrical Power</h2>
<p>Electrical power is the rate of energy conversion -- how fast electrical energy becomes heat, light, or mechanical work. The primary formula is P = IV, but since V = IR, you can substitute to get all three useful forms:</p>

<div class="formula-block">\[ P = IV = \frac{V^2}{R} = I^2 R \]</div>

<div class="example-box">
  <strong>Power Calculation:</strong> A 60 &Omega; light bulb is connected to a 120V circuit. Find current, power, and energy consumed in 1 hour.<br><br>
  Current: \( I = V/R = 120/60 = 2 \text{ A} \)<br>
  Power: \( P = IV = 2 \times 120 = 240 \text{ W} \) (or \( P = V^2/R = 14400/60 = 240 \text{ W} \))<br>
  Energy in 1 hour: \( E = P \times t = 240 \times 3600 \text{ s} = 864{,}000 \text{ J} \)<br><br>
  In kilowatt-hours: \( 0.24 \text{ kW} \times 1 \text{ hr} = 0.24 \text{ kWh} \).
</div>

<h2>Batteries -- Series vs. Parallel</h2>
<p>Batteries in series have their voltages added -- two 1.5V AA batteries in series make 3V. This is how flashlights get higher voltage. Batteries in parallel keep the same voltage but can supply more current (more total current capacity). Four 1.5V batteries in parallel still make 1.5V, but they last four times longer because each one provides only 1/4 the current.</p>

<div class="callout callout-tip">
  <div class="callout-title">Series Batteries: Add Voltage. Parallel Batteries: Add Capacity.</div>
  Need more voltage for a device? Put batteries in series. Need longer battery life without changing voltage? Put them in parallel. Both configurations are used in real devices -- laptop battery packs combine both to achieve the right voltage and capacity.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 13 -- Momentum & Impulse
# -------------------------------------------------------------------------
13: r"""
<h1>Momentum &amp; Impulse</h1>
<p class="lesson-subtitle">Momentum is one of the most conserved quantities in all of physics -- and understanding why it's conserved is what makes collision problems intuitive rather than formulaic.</p>

<h2>Linear Momentum -- What It Is and Why It Matters</h2>
<p>Momentum is the quantity of motion. It captures both how massive something is and how fast it's moving. A bowling ball rolling slowly might have the same momentum as a golf ball moving fast -- and it would take the same impulse to stop either one. Momentum is a vector: it has magnitude and direction. The direction of momentum is the same as the direction of velocity.</p>

<div class="formula-block">\[ p = mv \]</div>

<p>Units: kg&middot;m/s. There are no special named units for momentum -- it's always expressed this way. The importance of momentum comes from its conservation law: in a closed system (no external forces), total momentum is constant. This makes it an extraordinarily powerful tool for analyzing collisions without knowing any of the internal forces involved.</p>

<div class="example-box">
  <strong>Momentum Comparison:</strong><br><br>
  A 2000 kg truck at 5 m/s: \( p = 2000 \times 5 = 10{,}000 \text{ kg}\cdot\text{m/s} \)<br>
  A 0.05 kg baseball at 200{,}000 m/s: \( p = 0.05 \times 200{,}000 = 10{,}000 \text{ kg}\cdot\text{m/s} \)<br><br>
  Both have the same momentum. It would take the same impulse to bring either to rest. Speed and mass trade off equally in momentum -- both matter linearly. But kinetic energy goes as v&sup2;, so the fast baseball has far more kinetic energy.
</div>

<h2>Impulse -- Changing Momentum</h2>
<p>To change an object's momentum, you must apply a net force for some amount of time. The product of force and time is called impulse, and it equals the change in momentum. This is the impulse-momentum theorem, and it's one of the most practically useful equations in physics.</p>

<div class="formula-block">\[ J = F \Delta t = \Delta p = m\Delta v \]</div>

<p>The crucial insight: the same change in momentum can be achieved with a large force over a short time, or a small force over a long time. The impulse (F &times; &Delta;t) is the same -- only the distribution changes. Safety engineering exploits this constantly.</p>

<div class="example-box">
  <strong>Airbag vs. Rigid Wall:</strong> A 70 kg passenger decelerates from 15 m/s to 0 m/s in a crash.<br><br>
  Change in momentum: \( \Delta p = m\Delta v = 70 \times 15 = 1050 \text{ kg}\cdot\text{m/s} \) (must be removed)<br><br>
  Without airbag (stops in 0.02 s): \( F = \Delta p / \Delta t = 1050 / 0.02 = 52{,}500 \text{ N} \) -- potentially fatal force<br>
  With airbag (stops in 0.3 s): \( F = 1050 / 0.3 = 3{,}500 \text{ N} \) -- 15&times; less force<br><br>
  Same change in momentum. Same impulse. But the airbag extends the stopping time by 15&times;, reducing peak force by 15&times;. This is the engineering principle behind airbags, crumple zones, padded dashboards, and bicycle helmets.
</div>

<div class="callout callout-tip">
  <div class="callout-title">Why Catching a Ball Hurts Less When You "Give"</div>
  Catching a fast ball with a stiff, stationary hand concentrates the force change over a very short time -- high force, pain. If you pull your hand back as the ball arrives, you extend the stopping time, reducing the force. Same impulse, less force because more time. Athletes learn this instinctively; now you know the physics behind it.
</div>

<h2>Conservation of Momentum</h2>
<p>When no external forces act on a system of objects, the total momentum of the system is conserved -- it doesn't change. This is not an approximation. It follows directly from Newton's third law: if object A exerts force on object B, object B exerts an equal and opposite force on object A. These internal forces cancel in pairs, leaving the total system momentum unchanged.</p>

<div class="formula-block">\[ p_{\text{before}} = p_{\text{after}} \]</div>
<div class="formula-block">\[ m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f} \]</div>

<div class="example-box">
  <strong>Recoil Problem (Gun and Bullet):</strong> A 0.5 kg gun fires a 0.01 kg bullet at 400 m/s. What is the gun's recoil velocity?<br><br>
  Before firing: everything at rest, so total momentum = 0.<br>
  After firing: \( p_{\text{bullet}} + p_{\text{gun}} = 0 \)<br>
  \( 0.01 \times 400 + 0.5 \times v_{\text{gun}} = 0 \)<br>
  \( 4 + 0.5 v_{\text{gun}} = 0 \)<br>
  \( v_{\text{gun}} = -8 \text{ m/s} \) (negative = opposite direction to bullet)<br><br>
  The gun kicks back at 8 m/s. The bullet is 50&times; lighter but travels 50&times; faster -- same magnitude momentum, opposite directions, total = zero. Momentum is conserved.
</div>

<h2>Types of Collisions</h2>
<p>Momentum is always conserved in collisions (if no external forces). Kinetic energy is not always conserved. The type of collision depends on what happens to kinetic energy.</p>

<h3>Elastic Collisions</h3>
<p>Both momentum AND kinetic energy are conserved. Objects bounce off each other without any energy being lost to heat or deformation. Perfect elastic collisions are idealized -- billiard balls come close. Subatomic particle collisions can be truly elastic.</p>

<h3>Perfectly Inelastic Collisions</h3>
<p>Objects stick together after the collision. Maximum kinetic energy is lost (converted to heat, sound, and deformation), but momentum is still conserved. The two objects move together with a single common velocity after the collision.</p>

<div class="formula-block">\[ m_1 v_{1i} + m_2 v_{2i} = (m_1 + m_2) v_f \]</div>

<div class="example-box">
  <strong>Perfectly Inelastic Collision:</strong> A 1500 kg car moving at 20 m/s east collides with a stationary 2000 kg truck. They stick together. Find their combined velocity.<br><br>
  \( 1500 \times 20 + 2000 \times 0 = (1500 + 2000) \times v_f \)<br>
  \( 30{,}000 = 3500 \times v_f \)<br>
  \( v_f = 30{,}000 / 3500 \approx 8.57 \text{ m/s east} \)<br><br>
  After the crash, both vehicles move east at 8.57 m/s. KE before: \( \frac{1}{2}(1500)(400) = 300{,}000 \text{ J} \). KE after: \( \frac{1}{2}(3500)(73.4) \approx 128{,}450 \text{ J} \). About 57% of kinetic energy was converted to heat and deformation.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: "Perfectly Inelastic" vs. "Momentum Lost"</div>
  "Perfectly inelastic" does NOT mean momentum is lost -- momentum is ALWAYS conserved in collisions. "Perfectly inelastic" means kinetic energy loss is maximized, and the specific symptom is that the objects stick together and move as one. If the OAR asks whether momentum is conserved in a perfectly inelastic collision, the answer is yes -- always.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Momentum Is a Vector</div>
  When objects move in opposite directions, you must use signs. If car A moves right at +20 m/s and car B moves left at -15 m/s, a collision conserves the vector sum. Getting the signs wrong is the most common algebra error on momentum problems. Always define positive direction first, then assign signs consistently.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 14 -- Kinematics
# -------------------------------------------------------------------------
14: r"""
<h1>Kinematics -- Displacement, Velocity &amp; Acceleration</h1>
<p class="lesson-subtitle">Kinematics describes how objects move -- without asking why. Four equations connect displacement, velocity, acceleration, and time, and together they solve every constant-acceleration problem the OAR will throw at you.</p>

<h2>Displacement vs. Distance</h2>
<p>Distance is the total length of the path traveled -- always positive, always the odometer reading. Displacement is the net change in position from start to finish -- a vector with both magnitude and direction. A runner who completes one lap of a track covers a distance of 400 m but has zero displacement (ended where they started). This distinction matters enormously on the OAR.</p>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Round Trip = Zero Displacement</div>
  Any problem where an object returns to its starting point has zero displacement, but non-zero distance. If a question asks "what is the displacement after a round trip?" the answer is zero. If it asks "what is the distance?" add up all the path lengths. Read the question carefully -- they will use both words deliberately.
</div>

<h2>Speed vs. Velocity</h2>
<p>Speed is the magnitude of velocity -- it's always positive. Velocity includes direction -- it can be positive or negative depending on your coordinate system. A car moving left at 30 m/s has speed 30 m/s and velocity -30 m/s (if rightward is positive). Average speed is total distance &divide; total time. Average velocity is total displacement &divide; total time. For a round trip, average speed is positive (distance/time); average velocity is zero (zero displacement/time).</p>

<h2>Acceleration</h2>
<p>Acceleration is the rate of change of velocity. It's a vector -- it can be positive (speeding up in the positive direction) or negative (slowing down in the positive direction, or speeding up in the negative direction). Deceleration is just negative acceleration -- there's no separate physical concept. When a car brakes, acceleration is negative (opposing motion). When it speeds up, acceleration is positive.</p>

<div class="formula-block">\[ a = \frac{\Delta v}{\Delta t} = \frac{v_f - v_i}{t} \]</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Deceleration Is Negative Acceleration</div>
  The OAR occasionally says "a car decelerates at 5 m/s&sup2;." This means a = -5 m/s&sup2; (if forward is positive). Don't treat deceleration as a separate concept -- just use negative values in your equations. A car decelerating at 5 m/s&sup2; for 3 seconds loses 15 m/s of speed. That's it.
</div>

<h2>The Four Kinematic Equations (SUVAT)</h2>
<p>For constant acceleration, four equations relate the five kinematic variables: displacement (&Delta;x), initial velocity (v<sub>i</sub>), final velocity (v<sub>f</sub>), acceleration (a), and time (t). You're always given three and asked to find a fourth. Pick the equation that contains your three known variables and the one unknown.</p>

<div class="formula-block">\[ v_f = v_i + at \quad \text{(no displacement)} \]</div>
<div class="formula-block">\[ \Delta x = v_i t + \frac{1}{2}at^2 \quad \text{(no final velocity)} \]</div>
<div class="formula-block">\[ v_f^2 = v_i^2 + 2a\Delta x \quad \text{(no time)} \]</div>
<div class="formula-block">\[ \Delta x = \frac{v_i + v_f}{2} \times t \quad \text{(no acceleration)} \]</div>

<div class="example-box">
  <strong>Worked Example -- Stopping Distance:</strong> A car traveling at 25 m/s brakes with a deceleration of 5 m/s&sup2;. How far does it travel before stopping?<br><br>
  Known: \( v_i = 25 \text{ m/s} \), \( v_f = 0 \), \( a = -5 \text{ m/s}^2 \). Find: \( \Delta x \). No time given &rarr; use equation 3.<br><br>
  \( v_f^2 = v_i^2 + 2a\Delta x \)<br>
  \( 0 = 625 + 2(-5)\Delta x \)<br>
  \( 0 = 625 - 10\Delta x \)<br>
  \( \Delta x = 62.5 \text{ m} \)<br><br>
  The car stops in 62.5 m. If the speed were doubled to 50 m/s: \( \Delta x = 2500/10 = 250 \text{ m} \). Doubling speed quadruples stopping distance (because v is squared in equation 3).
</div>

<div class="example-box">
  <strong>Worked Example -- Free Fall Drop Height:</strong> An object is dropped from a tall building and takes 4 seconds to hit the ground. How tall is the building?<br><br>
  Known: \( v_i = 0 \) (dropped, not thrown), \( a = g = 10 \text{ m/s}^2 \), \( t = 4 \text{ s} \). Find: \( \Delta x \). No final velocity given &rarr; use equation 2.<br><br>
  \( \Delta x = v_i t + \frac{1}{2}at^2 = 0 + \frac{1}{2}(10)(16) = 80 \text{ m} \)<br><br>
  The building is 80 m tall (about 25 stories). Also: final velocity = \( v_i + at = 0 + 10 \times 4 = 40 \text{ m/s} \) (about 90 mph at impact).
</div>

<h2>Free Fall -- All Objects Fall at the Same Rate</h2>
<p>In a vacuum (ignoring air resistance), all objects fall with the same acceleration: g = 9.8 m/s&sup2; &asymp; 10 m/s&sup2;. A bowling ball and a feather dropped from the same height hit the ground simultaneously. This is not intuitive -- in everyday experience, heavier objects seem to fall faster. But that's air resistance, not gravity. Gravity itself is completely democratic about mass.</p>

<div class="callout callout-tip">
  <div class="callout-title">Use g = 10 m/s&sup2; on the OAR</div>
  The OAR consistently uses g = 10 m/s&sup2; for clean arithmetic. If you use 9.8 and get a messy answer, try 10 and see if it matches one of the choices. The test is designed around g = 10.
</div>

<h2>Projectile Motion</h2>
<p>A projectile is any object launched into the air and subject only to gravity (no thrust, no air resistance). The key insight: horizontal and vertical motions are completely independent. Horizontal: constant velocity (no horizontal force). Vertical: constant acceleration downward (gravity).</p>

<div class="formula-block">\[ \text{Horizontal: } x = v_{x} \cdot t \quad (v_x = v_0 \cos\theta, \text{ constant}) \]</div>
<div class="formula-block">\[ \text{Vertical: } y = v_{y0} t - \frac{1}{2}g t^2 \quad (v_{y0} = v_0 \sin\theta) \]</div>

<div class="example-box">
  <strong>Projectile Problem -- Time of Flight:</strong> A ball is launched horizontally at 15 m/s from a 20 m cliff. When does it land? How far from the base?<br><br>
  Vertical: starts with \( v_{y0} = 0 \) (horizontal launch), falls 20 m.<br>
  \( 20 = \frac{1}{2}(10)t^2 \) &rarr; \( t^2 = 4 \) &rarr; \( t = 2 \text{ s} \)<br><br>
  Horizontal: \( x = v_x \times t = 15 \times 2 = 30 \text{ m} \)<br><br>
  The ball lands 30 m from the cliff base after 2 seconds. The horizontal and vertical calculations were completely separate -- that's the power of treating them independently.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Horizontal vs. Vertical Are Independent</div>
  The most common projectile error: using the horizontal velocity when the question asks about vertical, or mixing horizontal distance into vertical time calculations. Always separate x and y. Horizontal has no acceleration. Vertical has g = 10 m/s&sup2;. Never mix them until recombining for the final answer.
</div>

<div class="callout callout-tip">
  <div class="callout-title">At the Peak of a Projectile's Arc</div>
  At the highest point, vertical velocity = 0 (momentarily). Horizontal velocity is unchanged (no horizontal force). The object is not stopped -- it's moving purely horizontally at that instant. This is a favorite OAR question: "What is the velocity at the peak?" Answer: only the horizontal component remains.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 15 -- Gas Laws
# -------------------------------------------------------------------------
15: r"""
<h1>Gas Laws</h1>
<p class="lesson-subtitle">Gas laws describe how pressure, volume, and temperature of a gas are related -- three variables that the OAR tests with real-world scenarios from tire pressure to scuba diving to aerosol cans.</p>

<h2>Why Gases Are Different</h2>
<p>Solids and liquids are nearly incompressible -- push on them and they don't change volume much. Gases are different. Gas molecules are far apart relative to their size, and they interact weakly. This means gases respond dramatically to changes in pressure, volume, and temperature. The gas laws describe these responses quantitatively.</p>
<p>The key insight before any calculation: gas temperature must always be in Kelvin, not Celsius. Why? Because Kelvin is the absolute temperature scale -- zero Kelvin (absolute zero) is the temperature at which molecular motion theoretically stops. At 0 Kelvin, a gas would have zero volume and zero pressure. Using Celsius would give nonsensical results like dividing by zero or getting negative volumes.</p>

<div class="formula-block">\[ T(\text{K}) = T(°\text{C}) + 273 \]</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Always Convert to Kelvin</div>
  If any gas law problem gives temperature in Celsius, convert to Kelvin before plugging into any equation. 20&deg;C = 293 K. -20&deg;C = 253 K. Not converting is guaranteed to produce a wrong answer. Every time. The test will give Celsius values specifically to catch students who forget to convert.
</div>

<h2>Boyle's Law -- Pressure and Volume (Constant Temperature)</h2>
<p>When temperature is held constant, pressure and volume are inversely proportional. Compress a gas into half the space and its pressure doubles. This is intuitive -- same number of molecules in half the volume means twice as many collisions with the walls per second, which is pressure.</p>

<div class="formula-block">\[ P_1 V_1 = P_2 V_2 \quad \text{(temperature constant)} \]</div>

<div class="example-box">
  <strong>Boyle's Law Problem:</strong> A gas at 3 atm occupies 8 L. Temperature stays constant. What volume does it occupy at 6 atm?<br><br>
  \( P_1 V_1 = P_2 V_2 \)<br>
  \( 3 \times 8 = 6 \times V_2 \)<br>
  \( V_2 = 24/6 = 4 \text{ L} \)<br><br>
  Pressure doubled &rarr; volume halved. That's the inverse relationship in action.
</div>

<div class="example-box">
  <strong>Real-World Application -- Scuba Diving:</strong> A scuba diver at 30 m depth breathes compressed air. At 30 m, absolute pressure is about 4 atm (1 from atmosphere + 3 from water column). If the diver surfaces quickly without exhaling, lung volume would quadruple (going from 4 atm to 1 atm). This would rupture the lungs -- which is why divers are trained to exhale continuously when ascending. Boyle's law is literally life-or-death in diving.
</div>

<h2>Charles's Law -- Volume and Temperature (Constant Pressure)</h2>
<p>When pressure is held constant, volume is directly proportional to absolute temperature. Heat a gas and it expands; cool it and it contracts. At constant pressure, the gas has freedom to expand when heated. This is why a hot air balloon rises -- heated air expands, becomes less dense, and the surrounding cooler air's buoyant force pushes the balloon up.</p>

<div class="formula-block">\[ \frac{V_1}{T_1} = \frac{V_2}{T_2} \quad \text{(pressure constant, T in Kelvin)} \]</div>

<div class="example-box">
  <strong>Charles's Law Problem:</strong> A balloon has a volume of 3.0 L at 20&deg;C. It is placed in a freezer at -20&deg;C. What is the new volume?<br><br>
  Convert to Kelvin: \( T_1 = 20 + 273 = 293 \text{ K} \), \( T_2 = -20 + 273 = 253 \text{ K} \)<br><br>
  \( \frac{3.0}{293} = \frac{V_2}{253} \)<br>
  \( V_2 = 3.0 \times \frac{253}{293} \approx 2.59 \text{ L} \)<br><br>
  The balloon shrinks by about 14% in the freezer. This is why tires seem to lose pressure in winter -- the air inside contracts slightly.
</div>

<h2>Gay-Lussac's Law -- Pressure and Temperature (Constant Volume)</h2>
<p>When volume is held constant (like a sealed rigid container), pressure is directly proportional to absolute temperature. Heat a closed container and pressure rises. This is why aerosol cans warn "do not incinerate" -- heating the can raises internal pressure until the can ruptures explosively. A car tire in summer has higher pressure than in winter for the same reason.</p>

<div class="formula-block">\[ \frac{P_1}{T_1} = \frac{P_2}{T_2} \quad \text{(volume constant, T in Kelvin)} \]</div>

<div class="example-box">
  <strong>Gay-Lussac's Law Problem:</strong> A sealed rigid container at 300 K has a pressure of 2 atm. It is heated to 450 K. What is the new pressure?<br><br>
  \( \frac{P_1}{T_1} = \frac{P_2}{T_2} \)<br>
  \( \frac{2}{300} = \frac{P_2}{450} \)<br>
  \( P_2 = 2 \times \frac{450}{300} = 3 \text{ atm} \)<br><br>
  Temperature increased by 50% (300 K &rarr; 450 K), so pressure increased by 50% (2 atm &rarr; 3 atm). Direct relationship confirmed.
</div>

<h2>The Combined Gas Law</h2>
<p>When all three variables (pressure, volume, temperature) change simultaneously, use the combined gas law. It's just Boyle's and Charles's laws merged. Think of it as "the master equation for gas behavior when two variables change at once."</p>

<div class="formula-block">\[ \frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2} \]</div>

<div class="example-box">
  <strong>Combined Gas Law Problem:</strong> A gas is at 2 atm, 5 L, and 300 K. It is compressed to 3 L and heated to 450 K. Find the new pressure.<br><br>
  \( \frac{2 \times 5}{300} = \frac{P_2 \times 3}{450} \)<br>
  \( \frac{10}{300} = \frac{3P_2}{450} \)<br>
  \( P_2 = \frac{10 \times 450}{300 \times 3} = \frac{4500}{900} = 5 \text{ atm} \)<br><br>
  Compression increased pressure (Boyle's effect) and heating increased it further (Gay-Lussac's effect). Both effects pushed pressure up, so 5 atm makes intuitive sense.
</div>

<div class="callout callout-tip">
  <div class="callout-title">OAR Strategy: Direct vs. Inverse Relationships</div>
  Before calculating, predict the direction of change using logic:<br>
  &bull; Volume and pressure: inverse (one up = other down) -- Boyle's Law<br>
  &bull; Volume and temperature: direct (both up or both down) -- Charles's Law<br>
  &bull; Pressure and temperature at constant volume: direct -- Gay-Lussac's Law<br><br>
  If your calculated answer moves in the wrong direction (e.g., compression increased volume), you made an algebra error. Sanity-check every answer against the qualitative prediction.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Inverse Relationship -- Pressure Up Means Volume Down</div>
  Students often confuse direct and inverse relationships. For Boyle's Law: if pressure doubles, volume halves -- NOT doubles. If you increase pressure from 1 atm to 4 atm, new volume = old volume / 4. Draw it out mentally: squeezing a balloon makes it smaller. Pressure up = volume down. Always.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 16 -- Heat Transfer
# -------------------------------------------------------------------------
16: r"""
<h1>Heat Transfer</h1>
<p class="lesson-subtitle">Heat always flows from hot to cold through exactly three mechanisms -- and knowing which mechanism applies in a given scenario is what the OAR tests, along with the specific heat formula and why different materials heat at different rates.</p>

<h2>Heat vs. Temperature -- A Critical Distinction</h2>
<p>Temperature measures the average kinetic energy of particles in a substance. Heat is the transfer of thermal energy from one object to another. A bathtub of warm water at 40&deg;C contains far more heat than a cup of boiling water at 100&deg;C -- even though the cup is hotter -- because the bathtub contains vastly more mass and therefore more total thermal energy. Temperature and heat are related but distinct quantities.</p>

<h2>Conduction -- Heat Through Direct Contact</h2>
<p>Conduction is heat transfer through a material without any bulk movement of the material itself. Energy passes from one molecule to the next through direct collisions, progressively carrying heat through the material. Conduction requires physical contact between the hot and cold regions and works best in solids, where molecules are close together and vibrate vigorously when heated.</p>
<p>Metals are excellent conductors because they have free electrons that can carry thermal energy rapidly through the material -- the same property that makes them good electrical conductors. Non-metals like wood, plastic, and glass conduct poorly -- we call them insulators. This is why metal and wood at the same room temperature feel different when touched: the metal rapidly conducts heat away from your warm hand (feels cold), while wood conducts poorly (feels relatively warm).</p>

<div class="callout callout-tip">
  <div class="callout-title">OAR Conduction Examples</div>
  &bull; Metal spoon in hot soup conducts heat to your hand<br>
  &bull; Insulation in walls slows conduction between inside and outside<br>
  &bull; Heat sinks on computer chips conduct heat away from the processor<br>
  &bull; The burning sensation when you touch a hot pan -- direct contact conduction
</div>

<h2>Convection -- Heat Through Fluid Movement</h2>
<p>Convection is heat transfer through the bulk movement of a fluid (liquid or gas). Hot fluid is less dense than cool fluid, so it rises. Cool fluid sinks to replace it. This creates circulation currents -- the classic "heat rises" phenomenon. Convection only occurs in fluids (liquids and gases), never in solids, because solids can't flow.</p>
<p>Natural convection is driven purely by density differences (hot air rising from a heater). Forced convection uses a pump or fan to move the fluid mechanically and is far more efficient -- why a fan makes you feel cooler even when the air temperature is the same. It constantly replaces the warm air layer near your skin with cooler air.</p>

<div class="callout callout-tip">
  <div class="callout-title">OAR Convection Examples</div>
  &bull; Boiling water -- hot water at bottom rises, cool water sinks<br>
  &bull; Sea breezes -- land heats faster than ocean, hot land air rises, cool ocean air replaces it<br>
  &bull; Car radiator -- coolant circulates (forced convection) to remove engine heat<br>
  &bull; Weather systems -- large-scale atmospheric convection cells drive wind patterns
</div>

<h2>Radiation -- Heat Through Electromagnetic Waves</h2>
<p>Radiation is heat transfer through electromagnetic waves -- specifically infrared radiation. It requires no medium whatsoever. This is the only way heat can travel through the vacuum of space, which is why we receive heat from the Sun across 150 million km of empty space. All objects emit thermal radiation proportional to the fourth power of their absolute temperature.</p>
<p>Dark, matte surfaces are better absorbers AND emitters of radiation than light, shiny surfaces. A black surface absorbs nearly all incident radiation (high emissivity). A polished silver surface reflects most radiation (low emissivity). This is why survival blankets are silver -- they reflect the person's own radiated heat back inward.</p>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Radiation Needs No Medium</div>
  The OAR occasionally asks: "How does heat from the Sun reach Earth?" The answer is radiation -- not convection (space has no fluid) and not conduction (no direct contact). Radiation is the only mechanism that works in a vacuum. If a scenario involves space or a vacuum, radiation is the only possible heat transfer mechanism.
</div>

<div class="example-box">
  <strong>Identifying the Mechanism:</strong><br><br>
  &bull; You touch a hot stove burner &rarr; <strong>Conduction</strong> (direct contact)<br>
  &bull; A campfire warms you from 3 meters away &rarr; <strong>Radiation</strong> (no contact, no fluid between)<br>
  &bull; Warm air from a heating vent fills a room &rarr; <strong>Convection</strong> (fluid movement)<br>
  &bull; A metal rod conducts heat from a flame at one end to the other &rarr; <strong>Conduction</strong><br>
  &bull; The Sun warms Earth &rarr; <strong>Radiation</strong> (crosses vacuum of space)
</div>

<h2>Specific Heat -- Q = mc&Delta;T</h2>
<p>Different materials require different amounts of heat energy to raise their temperature by the same amount. This property is called specific heat capacity (c). Water has one of the highest specific heats of any common substance -- 4,186 J/(kg&middot;K). Aluminum is about 900 J/(kg&middot;K). Iron is about 450 J/(kg&middot;K).</p>

<div class="formula-block">\[ Q = mc\Delta T \]</div>

<p>Q = heat energy (Joules), m = mass (kg), c = specific heat capacity, &Delta;T = temperature change (&deg;C or K -- the difference is the same).</p>

<div class="example-box">
  <strong>Specific Heat Problem:</strong> How much heat is needed to raise 2 kg of water from 20&deg;C to 80&deg;C? (c<sub>water</sub> = 4186 J/kg&middot;K)<br><br>
  \( Q = mc\Delta T = 2 \times 4186 \times (80 - 20) = 2 \times 4186 \times 60 = 502{,}320 \text{ J} \)<br><br>
  About 502 kJ. Compare to the same mass of iron (c &asymp; 450 J/kg&middot;K):<br>
  \( Q = 2 \times 450 \times 60 = 54{,}000 \text{ J} \) -- less than 1/9th the energy!<br><br>
  Water requires nearly 10&times; more energy to heat than iron for the same mass and temperature change. This is why water is an excellent coolant (used in car radiators, steam engines, nuclear reactors) and why coastal climates are more moderate than continental ones -- the ocean absorbs and releases heat slowly, buffering temperature swings.
</div>

<div class="callout callout-tip">
  <div class="callout-title">High Specific Heat = Good Coolant</div>
  High specific heat means a material can absorb lots of heat with little temperature rise. Water's exceptional specific heat makes it the universal coolant. Metals have low specific heat -- a metal pan heats up fast but also cools fast. This is why cast iron skillets (high mass) are preferred for even heat distribution, while thin aluminum pans heat quickly and unevenly.
</div>

<h2>Thermal Expansion</h2>
<p>Most materials expand when heated and contract when cooled. This happens because increased temperature increases molecular vibration, pushing molecules slightly further apart on average. The expansion is small but significant in engineering.</p>

<div class="callout callout-tip">
  <div class="callout-title">Engineering Applications of Thermal Expansion</div>
  &bull; Expansion joints in bridges and concrete sidewalks -- gaps allow expansion without buckling<br>
  &bull; Railroad tracks have small gaps between sections for the same reason<br>
  &bull; Jar lids run under hot water -- metal expands faster than glass, loosening the seal<br>
  &bull; Thermostats use bimetallic strips: two metals bonded together with different expansion rates, so the strip bends as temperature changes -- this bending opens or closes an electrical circuit
</div>

<div class="example-box">
  <strong>Bimetallic Strip -- OAR Favorite:</strong> A bimetallic strip consists of brass (higher thermal expansion) bonded to steel (lower thermal expansion). When heated, both metals expand, but brass expands more. Since they're bonded together, the strip bends -- it curves toward the steel side (because brass expanded more on the outer curve).<br><br>
  In a traditional thermostat: when the room cools below the set temperature, the strip bends in one direction, closing an electrical circuit and turning on the furnace. When the room heats to the set point, it bends back, opening the circuit and turning the furnace off.<br><br>
  OAR question form: "A bimetallic strip is made of metal A (high expansion) and metal B (low expansion). When heated, toward which metal does the strip bend?" Answer: toward metal B (low expansion) -- the shorter side of the bend.
</div>
""",

# -------------------------------------------------------------------------
# LESSON 17 -- Magnetism & Advanced Electrical Components
# -------------------------------------------------------------------------
17: r"""
<h1>Magnetism &amp; Advanced Electrical Components</h1>
<p class="lesson-subtitle">Electromagnetism -- the link between electricity and magnetism -- is the foundational principle behind motors, generators, and transformers, and the OAR tests your ability to identify energy direction and apply transformer equations correctly.</p>

<h2>Permanent Magnets</h2>
<p>Every magnet has two poles -- north and south -- that cannot be separated. Cut a bar magnet in half and you get two smaller magnets, each with a north and south pole. Magnetic field lines run from the north pole to the south pole outside the magnet, and from south to north inside. Like poles repel (N-N, S-S); opposite poles attract (N-S).</p>
<p>Ferromagnetic materials -- iron, cobalt, nickel -- can be magnetized because they have magnetic domains (regions where atomic magnetic moments align). In an unmagnetized piece of iron, domains point in random directions and cancel out. A strong external field aligns them, creating a permanent magnet.</p>

<div class="callout callout-tip">
  <div class="callout-title">Magnetic Materials to Know</div>
  Strongly magnetic (ferromagnetic): iron, steel, cobalt, nickel -- can be permanently magnetized<br>
  Weakly magnetic (paramagnetic): aluminum, platinum -- only magnetic in an external field<br>
  Non-magnetic (diamagnetic): copper, gold, silver, wood, glass -- essentially unaffected by magnets<br><br>
  OAR note: copper wire conducts electricity excellently but is not attracted to magnets. A copper wire carrying current creates a magnetic field, but the wire itself is not ferromagnetic.
</div>

<h2>Electromagnets -- Current Creates Magnetism</h2>
<p>Moving charges (electric current) always create magnetic fields. A straight wire carrying current creates a weak circular magnetic field around it. Wind the wire into a coil (solenoid) and the field from each loop adds constructively, creating a strong, concentrated magnetic field resembling a bar magnet. The more turns, the stronger the field. The more current, the stronger the field. Add an iron core and the iron's domain alignment multiplies the field dramatically.</p>

<div class="callout callout-tip">
  <div class="callout-title">Right-Hand Rule for Solenoids</div>
  Wrap your right hand around the solenoid coil with your fingers curling in the direction of conventional current flow. Your thumb points toward the magnetic north pole. This right-hand rule works for any solenoid and lets you identify which end is north given the current direction -- or which direction current flows given the north pole location.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Electromagnets vs. Permanent Magnets</div>
  An electromagnet can be switched on and off -- no current, no magnetism. Its strength is adjustable via current. A permanent magnet is always on -- you can't switch it off. The OAR will describe a scenario (junkyard crane picking up and releasing metal) and ask what type of magnet is used. Only an electromagnet can release the metal on command.
</div>

<h2>Motors -- Electrical Energy to Mechanical Energy</h2>
<p>An electric motor converts electrical energy into rotational mechanical energy. The operating principle: a current-carrying wire in a magnetic field experiences a force (the Lorentz force). In a motor, this force causes a loop of wire (the armature) to rotate within a magnetic field. As the armature spins, it drives a shaft, which does mechanical work.</p>
<p>Motors are everywhere: fans, pumps, compressors, electric vehicles, power tools, appliances. Every device that uses electricity to create motion contains a motor. The key: electrical energy in, mechanical motion out.</p>

<h2>Generators -- Mechanical Energy to Electrical Energy</h2>
<p>A generator is physically identical to a motor but run in reverse. Instead of using electrical current to create rotation, it uses rotation to create electrical current. When a conductor moves through a magnetic field (or a magnetic field changes through a stationary coil), an electromotive force (EMF) is induced -- this is Faraday's law of electromagnetic induction. Spinning a coil in a magnetic field induces AC voltage proportional to how fast the coil spins and how many turns it has.</p>
<p>Power plants are essentially giant generators: steam turbines (driven by coal, nuclear, or hydroelectric energy) spin massive coils in powerful magnetic fields, producing the AC electricity that enters your home.</p>

<div class="callout callout-tip">
  <div class="callout-title">Motor vs. Generator -- The Same Device in Reverse</div>
  Motor: electrical energy &rarr; mechanical energy (electricity makes things move)<br>
  Generator: mechanical energy &rarr; electrical energy (movement makes electricity)<br><br>
  They are literally the same physical device -- the difference is energy direction. Regenerative braking in electric cars uses this: the motors act as generators when braking, converting kinetic energy back into stored electrical energy.
</div>

<h2>Transformers -- Changing Voltage Levels</h2>
<p>A transformer changes AC voltage levels using electromagnetic induction. It consists of two coils (primary and secondary) wound on a common iron core. AC in the primary coil creates a changing magnetic field in the core. That changing field induces voltage in the secondary coil. The ratio of voltages equals the ratio of turns:</p>

<div class="formula-block">\[ \frac{V_s}{V_p} = \frac{N_s}{N_p} \]</div>
<div class="formula-block">\[ V_s \cdot I_s = V_p \cdot I_p \quad \text{(power conserved in ideal transformer)} \]</div>

<div class="example-box">
  <strong>Step-Up Transformer Problem:</strong> A transformer has 200 primary turns and 1000 secondary turns. Input voltage is 120V. Find output voltage and output current if input current is 10A.<br><br>
  Output voltage: \( V_s = V_p \times \frac{N_s}{N_p} = 120 \times \frac{1000}{200} = 600 \text{ V} \)<br><br>
  Power in = Power out (ideal): \( P = V_p I_p = 120 \times 10 = 1200 \text{ W} \)<br>
  Output current: \( I_s = P/V_s = 1200/600 = 2 \text{ A} \)<br><br>
  Voltage went up 5&times; (step-up). Current went down 5&times;. Power stayed the same. This is the fundamental trade-off in transformers: more voltage means less current. You can't get more power out than you put in.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Transformers Only Work with AC</div>
  Transformers require a changing magnetic field to work. Direct current (DC) creates a constant (not changing) magnetic field -- no change, no induction, no voltage transfer. Transformers simply don't work with DC. This is why the power grid uses AC: AC can be transformed to high voltages for efficient long-distance transmission, then stepped down to 120V for homes. DC cannot be practically transformed at large scale with simple transformers.
</div>

<div class="callout callout-warning">
  <div class="callout-title">OAR Trap: Step-Up Voltage Means Step-Down Current</div>
  Students think step-up transformer = more power out. Wrong. Power is conserved. More voltage out &rarr; proportionally less current out. A transformer steps up voltage or steps down voltage -- it cannot create power. If output voltage is 10&times; input, output current is 1/10 input current. Always check: \( V_p I_p = V_s I_s \).
</div>

<div class="callout callout-tip">
  <div class="callout-title">Step-Up vs. Step-Down -- Which Is Which</div>
  Step-up transformer: more turns on secondary coil than primary. Secondary voltage &gt; primary voltage. Current goes down. Used to transmit power over long distances at high voltage (less energy lost to resistance).<br>
  Step-down transformer: fewer turns on secondary coil than primary. Secondary voltage &lt; primary voltage. Current goes up. Used to bring high transmission voltage down to safe household levels (120V or 240V).
</div>

<h2>Capacitors -- Storing Charge</h2>
<p>A capacitor stores electrical energy in an electric field between two conducting plates separated by an insulator (dielectric). Unlike a battery (which stores energy chemically and releases it slowly), a capacitor can release its stored energy almost instantaneously. This makes capacitors ideal for applications requiring rapid energy bursts: camera flashes, defibrillators, and filter circuits.</p>

<div class="formula-block">\[ C = \frac{Q}{V} \quad E_{\text{stored}} = \frac{1}{2}CV^2 \]</div>

<p>Capacitance (C) is measured in Farads (F). A larger capacitor stores more charge at the same voltage. Key behavior: capacitors block DC (charge builds up, opposing further current flow) but pass AC (the alternating voltage continuously charges and discharges the capacitor). This makes capacitors useful as filters -- blocking DC offsets while letting AC signals through.</p>

<h2>Inductors -- Storing Energy in Magnetic Fields</h2>
<p>An inductor is essentially a coil of wire that stores energy in its magnetic field when current flows through it. The critical behavior of an inductor: it opposes changes in current. When current increases, the inductor's magnetic field grows and the inductor generates a voltage opposing the increase. When current decreases, the collapsing field generates voltage trying to maintain the current. This property (called inductance) makes inductors useful for smoothing current in power supplies and for frequency filtering.</p>

<div class="callout callout-tip">
  <div class="callout-title">Capacitor vs. Inductor -- The Key Contrast</div>
  Capacitor: stores energy in ELECTRIC field, opposes changes in VOLTAGE, blocks DC, passes AC<br>
  Inductor: stores energy in MAGNETIC field, opposes changes in CURRENT, passes DC (after initial transient), blocks high-frequency AC<br><br>
  The OAR doesn't require deep math on these, but does test the qualitative behaviors and whether you know which stores what kind of field energy.
</div>

<div class="example-box">
  <strong>OAR Scenario Questions:</strong><br><br>
  <strong>Q: A transformer is connected to a DC battery. Does it step up the voltage?</strong><br>
  No. Transformers require AC. DC creates constant magnetic flux -- no change, no induced EMF in secondary coil.<br><br>
  <strong>Q: A generator is connected to a motor. What energy conversions occur?</strong><br>
  Generator: mechanical &rarr; electrical. Motor: electrical &rarr; mechanical. Two conversions, each less than 100% efficient, so some energy is lost to heat at each stage.<br><br>
  <strong>Q: A transformer steps voltage from 480V to 120V. The turns ratio N<sub>p</sub>/N<sub>s</sub> is:</strong><br>
  \( N_p/N_s = V_p/V_s = 480/120 = 4 \). The primary has 4 times as many turns as the secondary (step-down: more primary turns = less secondary voltage).
</div>
"""

}

if __name__ == "__main__":
    print(f"MECHANICAL_LESSONS loaded: {len(MECHANICAL_LESSONS)} lessons")
    for lesson_id, html in sorted(MECHANICAL_LESSONS.items()):
        char_count = len(html)
        print(f"  Lesson {lesson_id}: {char_count:,} chars")
