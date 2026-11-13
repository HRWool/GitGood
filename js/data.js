/* Git Good — seed data for the clickable prototype. Everything here is fake. */

const SKILLS = [
  { id: "Python", icon: "🐍" },
  { id: "Java", icon: "☕" },
  { id: "Web", icon: "🌐" },
  { id: "SQL", icon: "🗄️" },
  { id: "DSA", icon: "🧩" },
  { id: "Git", icon: "🔀" },
  { id: "PHP", icon: "🐘" },
  { id: "C++", icon: "⚙️" },
];

const AVATARS = ["🦊", "🐢", "🦉", "🐙", "🐝", "🦖", "🐧", "🐲"];

// Week-in "Maya" — loaded only when the user explicitly chooses the demo account.
const DEFAULT_STATE = {
  onboarded: true,
  authenticated: false,
  fresh: false,
  name: "Maya Chen",
  username: "maya_codes",
  email: "mchen42@charlotte.edu",
  avatar: "🦊",
  skills: ["Python", "Web"],
  xp: 520,
  classXp: 585,
  streak: 6,
  bestStreak: 9,
  week: [1, 1, 1, 1, 1, 1, 0], // Mon..Sun, today = Sun
  freezes: 1,
  earned: ["hello-world", "streak-3", "python-1", "night-owl", "class-act", "streak-7"],
  earnedOn: {
    "hello-world": "Oct 10, 2026", "streak-3": "Oct 12, 2026", "python-1": "Oct 13, 2026",
    "night-owl": "Oct 13, 2026", "class-act": "Oct 14, 2026", "streak-7": "Oct 16, 2026",
  },
  justUnlocked: "streak-7",
  newBadge: true,
  pinned: ["streak-7", "python-1", "class-act"],
  doneToday: ["daily-web"],
  classDone: ["class-for"],
  questsTotal: 23,
  badgeProgress: {
    "python-2": 14, "java-1": 6, "speed-runner": 4,
    "web-1": 3, "git-1": 0, "bug-squasher": 3, "early-bird": 0, helper: 2,
  },
  joinedClass: "python",
  prefs: { streak: true, quest: true, leaderboard: false },
  friends: { invites: [], accepted: [], pending: [] },
  lastRankMove: null,
};

// Brand-new account created by the sign-up flow.
const FRESH_STATE = {
  onboarded: true,
  authenticated: false,
  name: "",
  username: "",
  email: "",
  avatar: "🦊",
  skills: [],
  xp: 0,
  classXp: 0,
  streak: 0,
  bestStreak: 0,
  week: [0, 0, 0, 0, 0, 0, 0],
  freezes: 0,
  earned: [],
  earnedOn: {},
  justUnlocked: null,
  newBadge: false,
  pinned: [],
  doneToday: [],
  classDone: [],
  questsTotal: 0,
  badgeProgress: {
    "python-2": 0, "java-1": 0, "speed-runner": 0,
    "web-1": 0, "git-1": 0, "bug-squasher": 0, "early-bird": 0, helper: 0,
  },
  joinedClass: null,
  fresh: true,
  prefs: { streak: true, quest: true, leaderboard: false },
  friends: { invites: [], accepted: [], pending: [] },
  lastRankMove: null,
};

const BADGES = [
  { id: "hello-world", name: "Hello, World", icon: "👋", type: "Skills", slug: "h3lo", requirement: "Finish your very first quest." },
  { id: "streak-3", name: "On Fire", icon: "🔥", type: "Streaks", slug: "f1r3", requirement: "Practice 3 days in a row.", goal: 3, track: "streak" },
  { id: "streak-7", name: "7-Day Streak", icon: "⚡", type: "Streaks", slug: "7f3k", requirement: "Practice 7 days in a row.", goal: 7, track: "streak" },
  { id: "streak-30", name: "30-Day Streak", icon: "🌋", type: "Streaks", slug: "v30x", requirement: "Practice 30 days in a row.", goal: 30, track: "streak" },
  { id: "python-1", name: "Python Lvl 1", icon: "🐍", type: "Skills", slug: "py01", requirement: "Complete 10 Python quests." },
  { id: "python-2", name: "Python Lvl 2", icon: "🐍", type: "Skills", slug: "py02", requirement: "Complete 25 Python quests.", goal: 25 },
  { id: "java-1", name: "Java Lvl 1", icon: "☕", type: "Skills", slug: "jv01", requirement: "Complete 10 Java quests.", goal: 10 },
  { id: "speed-runner", name: "Speed Runner", icon: "⏱️", type: "Skills", slug: "sp33", requirement: "Beat the clock on 5 timed quests.", goal: 5 },
  { id: "web-1", name: "Web Weaver", icon: "🕸️", type: "Skills", slug: "wb01", requirement: "Complete 8 Web quests.", goal: 8 },
  { id: "git-1", name: "Merge Master", icon: "🔀", type: "Skills", slug: "gt01", requirement: "Complete the Git & Command Line class.", goal: 6 },
  { id: "night-owl", name: "Night Owl", icon: "🦉", type: "Streaks", slug: "n1gh", requirement: "Finish a quest after 10 PM." },
  { id: "class-act", name: "Class Act", icon: "🎓", type: "Seasons", slug: "c1as", requirement: "Join your first classroom." },
  { id: "season-top3", name: "Season 1 · Top 3", icon: "🏆", type: "Seasons", slug: "s1t3", requirement: "Finish a classroom season in the top 3." },
  { id: "bug-squasher", name: "Bug Squasher", icon: "🐛", type: "Skills", slug: "bg10", requirement: "Pass 10 quests without using a hint.", goal: 10 },
  { id: "early-bird", name: "Early Bird", icon: "🌅", type: "Streaks", slug: "e4rl", requirement: "Finish a quest before 8 AM.", goal: 1 },
  { id: "helper", name: "Study Buddy", icon: "🤝", type: "Seasons", slug: "p41r", requirement: "Add 3 friends to your leaderboard.", goal: 3 },
];

/* Exercises. Code lines use {0}, {1}… for blanks; `answers` lists accepted values per blank.
   `practiced` lists the concepts a quest covers; the reward screen shows them as "Skills practiced". */
const QUESTS = {
  first: {
    title: "Count the café orders",
    skill: "Python", icon: "☕", xp: 50, minutes: 5, level: "Easy",
    practiced: ["for loops", "lists", "running totals"],
    speaker: { name: "Prospector Café", who: "☕", role: "Customer" },
    story: "Hi! We sold 3, 5 and 8 lattes this morning. Can you write a loop that adds them up so I know how many cups to restock?",
    prompt: "Fill in the blanks so the loop adds every order to total.",
    code: [
      "orders = [3, 5, 8]",
      "total = 0",
      "for n in {0}:",
      "    total {1} n",
      "print(total)   # should print 16",
    ],
    answers: [["orders"], ["+="]],
    tests: ["Loops over every order", "Adds each order to total", "Prints 16"],
    hint: "The loop should walk through the list named orders, and += adds to a running total.",
    badge: "hello-world",
    next: "home.html",
  },
  "class-while": {
    title: "While loops and counters",
    skill: "Python", icon: "🔁", xp: 50, minutes: 8, level: "Easy",
    practiced: ["while loops", "comparison operators", "counters"],
    speaker: { name: "Prof. Byte", who: "🤖", role: "AI instructor · Python Beginners" },
    story: "The pep band wants the crowd to chant exactly three times. Let's use a while loop with a counter so it stops on time!",
    prompt: "Make the loop run exactly 3 times.",
    code: [
      "count = 0",
      "while count {0} 3:",
      "    print(\"Go Niners!\")",
      "    count {1} 1",
    ],
    answers: [["<", "!="], ["+="]],
    tests: ["Loop condition stops at 3", "Counter goes up each time", "Prints the chant 3 times"],
    hint: "Keep looping while count is less than 3, and add 1 to count each pass.",
    next: "class.html",
    classQuest: "class-while",
  },
  "class-timed": {
    title: "Timed: loop challenge",
    skill: "Python", icon: "⏱️", xp: 75, minutes: 5, level: "Medium", timed: 300,
    practiced: ["for loops", "if statements", "counting matches"],
    speaker: { name: "Prof. Byte", who: "🤖", role: "AI instructor · Python Beginners" },
    story: "Speed round! The registrar needs a quick count of students over 21 credit hours. Beat the clock!",
    prompt: "Count how many values in credits are greater than 21.",
    code: [
      "credits = [18, 24, 12, 22, 30]",
      "over = 0",
      "for c in credits:",
      "    if c {0} 21:",
      "        over += {1}",
      "print(over)   # should print 3",
    ],
    answers: [[">"], ["1"]],
    tests: ["Compares against 21", "Counts one per match", "Prints 3"],
    hint: "Use > to check greater-than, and add 1 each time it's true.",
    next: "class.html",
    classQuest: "class-timed",
  },
  "lb-timed": {
    title: "Timed: list loops",
    skill: "Python", icon: "⏱️", xp: 50, minutes: 5, level: "Easy", timed: 300,
    practiced: ["for loops", "lists", "len()"],
    speaker: { name: "Niner Rec Center", who: "🏀", role: "Customer" },
    story: "We need to greet everyone on today's pickup roster. Quick—can you loop through the names before tip-off?",
    prompt: "Print a greeting for every name on the roster.",
    code: [
      "roster = [\"Priya\", \"Sam\", \"Lena\"]",
      "for {0} in roster:",
      "    print(\"Hi, \" + name)",
      "print(len({1}), \"players\")",
    ],
    answers: [["name"], ["roster"]],
    tests: ["Loop variable matches name", "Counts the roster", "Greets 3 players"],
    hint: "The print line uses a variable called name, and len() needs the list.",
    next: "leaderboard.html?moved=1",
    fromLeaderboard: true,
  },
  "daily-web": {
    title: "Center the signup button",
    skill: "Web", icon: "🌐", xp: 30, minutes: 4, level: "Easy",
    practiced: ["flexbox", "centering", "CSS properties"],
    speaker: { name: "Student Gov't", who: "🗳️", role: "Customer" },
    story: "Our election page button is stuck in the corner. Can you center it with flexbox?",
    prompt: "Center the button horizontally and vertically.",
    code: [
      ".hero {",
      "  display: {0};",
      "  justify-content: {1};",
      "  align-items: center;",
      "}",
    ],
    answers: [["flex"], ["center"]],
    tests: ["Uses flexbox", "Centers horizontally", "Button is centered"],
    hint: "display: flex turns on flexbox; justify-content handles the horizontal axis.",
    next: "home.html",
  },
  "daily-git": {
    title: "Branch before you build",
    skill: "Git", icon: "🔀", xp: 30, minutes: 3, level: "Easy",
    practiced: ["branching", "commits", "commit messages"],
    speaker: { name: "Team Lead", who: "🧑‍💻", role: "Customer" },
    story: "Please don't commit straight to main! Make a feature branch, then commit your fix with a message.",
    prompt: "Create a branch, then commit.",
    code: [
      "git {0} -b fix-navbar",
      "git add .",
      "git {1} -m \"Fix navbar spacing\"",
    ],
    answers: [["checkout", "switch"], ["commit"]],
    tests: ["Creates a new branch", "Commits with a message", "main stays clean"],
    hint: "git checkout -b makes a branch; git commit -m saves your work with a message.",
    next: "home.html",
  },
  "daily-py": {
    title: "Fix the off-by-one",
    skill: "Python", icon: "🐍", xp: 40, minutes: 5, level: "Easy",
    practiced: ["range()", "off-by-one errors", "for loops"],
    speaker: { name: "Atkins Library", who: "📚", role: "Customer" },
    story: "Our countdown sign skips number 1! It should show 5, 4, 3, 2, 1. Can you fix the range?",
    prompt: "Make the countdown include 1.",
    code: [
      "for i in range(5, {0}, -1):",
      "    print(i)",
      "print(\"{1}!\")   # what does the sign say at the end?",
    ],
    answers: [["0"], ["Liftoff"]],
    acceptAny: [false, true],
    tests: ["Range stops after 1", "Counts down by 1", "Prints a finale"],
    hint: "range() stops BEFORE the end value, so to include 1 you stop at 0. The finale can be anything fun like Liftoff.",
    next: "home.html",
  },
  "daily-java": {
    title: "Print the shuttle stops",
    skill: "Java", icon: "☕", xp: 40, minutes: 5, level: "Easy",
    practiced: ["for loops", "arrays", "array indexing"],
    speaker: { name: "Niner Transit", who: "🚌", role: "Customer" },
    story: "Our shuttle display skipped a stop yesterday. Can you loop through the stops array and print every one?",
    prompt: "Print every stop in the array, in order.",
    code: [
      "String[] stops = {\"Union\", \"Library\", \"Gym\"};",
      "for (int i = 0; i {0} stops.length; i++) {",
      "    System.out.println(stops[{1}]);",
      "}",
    ],
    answers: [["<"], ["i"]],
    tests: ["Stops before running off the end", "Uses the loop index", "Prints all 3 stops"],
    hint: "Keep going while i is less than stops.length, and use i to pick each stop.",
    next: "home.html",
  },
  "daily-sql": {
    title: "Find the full-time students",
    skill: "SQL", icon: "🗄️", xp: 40, minutes: 4, level: "Easy",
    practiced: ["SELECT", "WHERE filters", "comparison operators"],
    speaker: { name: "Registrar's Office", who: "🏛️", role: "Customer" },
    story: "We need a list of everyone taking 12 or more credits this semester. Can you filter the students table?",
    prompt: "Return students taking 12 or more credits.",
    code: [
      "SELECT name, credits",
      "FROM students",
      "{0} credits {1} 12;",
    ],
    answers: [["WHERE", "where"], [">="]],
    tests: ["Filters the rows", "Includes exactly 12 credits", "Returns full-time students"],
    hint: "WHERE filters rows, and >= keeps students with exactly 12 credits too.",
    next: "home.html",
  },
  "daily-dsa": {
    title: "Find the high score",
    skill: "DSA", icon: "🧩", xp: 40, minutes: 5, level: "Easy",
    practiced: ["linear search", "tracking a maximum", "comparisons"],
    speaker: { name: "Esports Club", who: "🎮", role: "Customer" },
    story: "Tournament night! Scan the scores and tell us the best one so we can crown a winner.",
    prompt: "Keep the biggest score in best.",
    code: [
      "scores = [72, 95, 88]",
      "best = scores[0]",
      "for s in scores:",
      "    if s {0} best:",
      "        best = {1}",
      "print(best)   # should print 95",
    ],
    answers: [[">"], ["s"]],
    tests: ["Compares each score to best", "Updates best when it finds a bigger one", "Prints 95"],
    hint: "Replace best whenever the current score s is greater than it.",
    next: "home.html",
  },
  "daily-cpp": {
    title: "Total the parking fines",
    skill: "C++", icon: "⚙️", xp: 40, minutes: 5, level: "Easy",
    practiced: ["range-based for loops", "arrays", "running totals"],
    speaker: { name: "Parking Services", who: "🅿️", role: "Customer" },
    story: "Three tickets came in today. Add them up so we can close out the register.",
    prompt: "Add every fine to total, then print it.",
    code: [
      "int fines[] = {20, 35, 15};",
      "int total = 0;",
      "for (int f : fines) total {0} f;",
      "std::cout << {1};   // prints 70",
    ],
    answers: [["+="], ["total"]],
    tests: ["Adds each fine", "Prints the running total", "Total is 70"],
    hint: "+= adds f to the total each pass; then print total.",
    next: "home.html",
  },
  "daily-php": {
    title: "Greet the new member",
    skill: "PHP", icon: "🐘", xp: 30, minutes: 3, level: "Easy",
    practiced: ["echo", "string concatenation", "variables"],
    speaker: { name: "49ers Coding Club", who: "💻", role: "Customer" },
    story: "Our sign-up page should say hi to each new member by name. Can you finish the greeting?",
    prompt: "Print a welcome message that includes $name.",
    code: [
      "$name = \"Lena\";",
      "{0} \"Welcome, \" {1} $name;",
    ],
    answers: [["echo", "print"], ["."]],
    tests: ["Prints output", "Joins the strings", "Says Welcome, Lena"],
    hint: "echo prints in PHP, and a dot (.) joins two strings.",
    next: "home.html",
  },
};

function answerIsAccepted(accepted, value, acceptAny = false) {
  const normalized = value.trim().replace(/\s+/g, "");
  return (acceptAny && normalized.length > 0) || accepted.some((answer) => answer.trim().replace(/\s+/g, "") === normalized);
}

// Pool of daily quests. Each student only gets the ones that match their skills (see GG.dailyQuests).
const DAILY = ["daily-py", "daily-web", "daily-git", "daily-java", "daily-sql", "daily-dsa", "daily-cpp", "daily-php"];

const FIRST_QUESTS = {
  Python: "first",
  Web: "daily-web",
  Git: "daily-git",
  Java: "daily-java",
  SQL: "daily-sql",
  DSA: "daily-dsa",
  "C++": "daily-cpp",
  PHP: "daily-php",
};

function firstQuestFor(skills) {
  const selected = Array.isArray(skills) ? skills : [];
  return selected.map((skill) => FIRST_QUESTS[skill]).find(Boolean) || "first";
}

const CLASSES = [
  {
    id: "python", name: "Python Beginners", level: "Beginner", members: 38, icon: "🐍", color: "linear-gradient(135deg,#00A651,#005035)", skill: "Python",
    topic: "Loops", week: 3, weeks: 4,
    byte: "Nice work on lists! This week is all about loops. Finish all three quests to hit the weekly goal.",
    quests: [
      { id: "class-for", title: "For loops basics", meta: "+40 XP", q: "first" },
      { id: "class-while", title: "While loops and counters", meta: "~8 min · Goal: 3/3 tests · +50 XP", q: "class-while" },
      { id: "class-timed", title: "Timed: loop challenge", meta: "5 min limit · +75 XP · Due Sun", q: "class-timed" },
    ],
  },
  {
    id: "java", name: "Java Intermediate", level: "Intermediate", members: 24, icon: "☕", color: "linear-gradient(135deg,#FF7A1A,#C2410C)", skill: "Java",
    topic: "Classes & objects", week: 3, weeks: 4,
    byte: "This week we build our own classes. Think blueprints: one Student class, many students!",
    quests: [
      { id: "java-1", title: "Your first class", meta: "+40 XP", q: "class-while" },
      { id: "java-2", title: "Constructors", meta: "~8 min · +50 XP", q: "class-while" },
      { id: "java-3", title: "Timed: getters & setters", meta: "5 min limit · +75 XP", q: "class-timed" },
    ],
  },
  {
    id: "web", name: "Web Foundations", level: "Beginner", members: 31, icon: "🌐", color: "linear-gradient(135deg,#3BA6FF,#1E5FB8)", skill: "Web",
    topic: "Flexbox layouts", week: 3, weeks: 4,
    byte: "Flexbox week! By Sunday you'll be centering divs in your sleep.",
    quests: [
      { id: "web-1", title: "Center anything", meta: "+30 XP", q: "daily-web" },
      { id: "web-2", title: "Navbar with flex", meta: "~8 min · +50 XP", q: "daily-web" },
      { id: "web-3", title: "Timed: card grid", meta: "5 min limit · +75 XP", q: "class-timed" },
    ],
  },
  {
    id: "sql", name: "SQL & Data", level: "Beginner", members: 19, icon: "🗄️", color: "linear-gradient(135deg,#8E5CF7,#5B34C4)", skill: "SQL",
    topic: "SELECT & WHERE", week: 3, weeks: 4,
    byte: "Let's ask the database good questions. This week: filtering rows with WHERE.",
    quests: [
      { id: "sql-1", title: "SELECT basics", meta: "+30 XP", q: "class-while" },
      { id: "sql-2", title: "Filter with WHERE", meta: "~8 min · +50 XP", q: "class-while" },
      { id: "sql-3", title: "Timed: query sprint", meta: "5 min limit · +75 XP", q: "class-timed" },
    ],
  },
  {
    id: "dsa", name: "DSA (Timed)", level: "Timed", members: 27, icon: "🧩", color: "linear-gradient(135deg,#F5C542,#B3A369)", skill: "DSA", dark: true,
    topic: "Two pointers", week: 3, weeks: 4,
    byte: "Interview-style speed rounds. Every quest is on the clock—warm up those fingers!",
    quests: [
      { id: "dsa-1", title: "Timed: reverse a list", meta: "5 min limit · +75 XP", q: "class-timed" },
      { id: "dsa-2", title: "Timed: find the pair", meta: "5 min limit · +75 XP", q: "class-timed" },
      { id: "dsa-3", title: "Timed: palindrome check", meta: "5 min limit · +75 XP", q: "class-timed" },
    ],
  },
  {
    id: "git", name: "Git & Command Line", level: "Season 2", members: 0, icon: "🔀", color: "linear-gradient(135deg,#12261C,#2d4a3b)", skill: "Git", locked: true,
    topic: "Branching", week: 1, weeks: 4,
    byte: "Welcome to Season 2! We'll learn to branch, commit and merge like a pro. Quit forking around!",
    quests: [
      { id: "git-1", title: "Branch before you build", meta: "+30 XP", q: "daily-git" },
      { id: "git-2", title: "Commit messages that slap", meta: "~6 min · +40 XP", q: "daily-git" },
      { id: "git-3", title: "Timed: merge conflict", meta: "5 min limit · +75 XP", q: "class-timed" },
    ],
  },
];

// Weekly XP — other students. "You" is inserted from state.
const LB_APP = [
  ["Marcus R.", "🦁", 1480], ["Priya S.", "🐼", 1310], ["Tariq A.", "🐯", 1205], ["Jordan P.", "🐨", 1010],
  ["Kendra W.", "🦄", 940], ["Shaun K.", "🐺", 880], ["Celeste D.", "🦋", 790], ["Omar B.", "🐸", 720],
  ["Hannah L.", "🐰", 660], ["Lena N.", "🦩", 585], ["Sam M.", "🐻", 560], ["Devon W.", "🐵", 505],
  ["Aisha O.", "🐱", 490], ["Ravi T.", "🐮", 430], ["Grace H.", "🐞", 360], ["Leo C.", "🦔", 240],
  ["Mia F.", "🐣", 120], ["Noah J.", "🐌", 45],
];
const LB_CLASS = [
  ["Priya S.", "🐼", 720], ["Marcus R.", "🦁", 690], ["Tariq A.", "🐯", 610], ["Lena N.", "🦩", 560],
  ["Devon W.", "🐵", 500], ["Jordan P.", "🐨", 470], ["Aisha O.", "🐱", 410], ["Ravi T.", "🐮", 350],
  ["Grace H.", "🐞", 280], ["Leo C.", "🦔", 150],
];
const LB_FRIENDS = [
  ["Sam M.", "🐻", 560], ["Priya S.", "🐼", 1310], ["Devon W.", "🐵", 505], ["Aisha O.", "🐱", 490],
];

// Social proof ticker on Home.
const FEED = [
  ["🐼", "Priya", "just earned <b>30-Day Streak</b> 🌋"],
  ["🐻", "Sam", "finished <b>Timed: list loops</b> in 2:41"],
  ["🦩", "Lena", "joined <b>Python Beginners</b>"],
  ["🐯", "Tariq", "is 1 quest from the Season 1 podium"],
];

// Screen index for the demo panel + per-screen feedback prompts.
const PAGES = [
  { file: "index.html", title: "Welcome", group: "Onboarding", tip: "First impression: logo, tagline and what the app promises.", ask: ["Would this make you sign up?", "Is the tagline clear?"] },
  { file: "signup.html", title: "Sign up", group: "Onboarding", tip: "UNCC-only sign-up. Try a @gmail.com address to see it rejected.", ask: ["Is UNCC-only a plus or a turn-off?"] },
  { file: "skills.html", title: "Pick skills", group: "Onboarding", tip: "Your picks shape daily quests and the recommended classroom.", ask: ["Which skills are missing?"] },
  { file: "quiz-intro.html", title: "First quest", group: "Onboarding", tip: "The first quest is framed as a customer request and can be skipped.", ask: ["Does the story framing make it more fun?"] },
  { file: "exercise.html?q=first", title: "Exercise", group: "Onboarding", tip: "Fill in the blanks, press Run. Wrong answers shake; hints are free.", ask: ["Is 5 minutes the right size?", "Too easy or too hard?"] },
  { file: "home.html", title: "Home", group: "Daily loop", tip: "One featured quest, daily progress, streak, and optional learning path and community sections.", ask: ["What would bring you back tomorrow?"] },
  { file: "notifications.html", title: "Notifications", group: "Daily loop", tip: "Reminders read like customer requests. Toggle what you get.", ask: ["Which of these would annoy you?"] },
  { file: "profile.html", title: "Profile", group: "Daily loop", tip: "Level, skills, pinned badges, learning path and streak freezes.", ask: ["What else belongs on your profile?"] },
  { file: "classes.html", title: "Classrooms", group: "Classrooms", tip: "AI-led seasonal classrooms. One is recommended from your skills.", ask: ["Would you join more than one?"] },
  { file: "class.html?c=python", title: "Class home", group: "Classrooms", tip: "Prof. Byte posts the weekly topic; quests unlock in order.", ask: ["Does an AI instructor feel helpful or gimmicky?"] },
  { file: "season.html", title: "Season results", group: "Classrooms", tip: "Seasons reset every 4 weeks. Top 3 earn a shareable badge.", ask: ["Is a 4-week season the right length?"] },
  { file: "leaderboard.html", title: "Leaderboard", group: "Leaderboard", tip: "Centered on YOU and your neighbors, with the exact XP gap and a quest to close it.", ask: ["Motivating or stressful?", "Would you use Friends or Class more?"] },
  { file: "achievements.html", title: "Achievements", group: "Achievements", tip: "Trophy case. Tap any badge. Share one to get a verify link + QR.", ask: ["Would you put one of these on LinkedIn?"] },
  { file: "verify.html", title: "Public verify page", group: "Achievements", tip: "Employer view: the public page behind a shared badge link or QR code. No login needed. Shows your newest badge.", ask: ["Does this look trustworthy?"] },
  { file: "storyboard.html", title: "📖 Storyboard & sketches", group: "Behind the design", tip: "Storyboard and sketches that led to each screen.", ask: [] },
];

/* Issue #3: daily quests follow the skills the student picked (their career path settings).
   Unknown or custom skills are ignored; with several skills, quests rotate between them so
   every picked skill gets a turn. Returns quest ids from DAILY, at most `max`. */
function dailyQuestsFor(skills, max = 3) {
  const known = [...new Set(Array.isArray(skills) ? skills : [])].filter((s) => SKILLS.some((k) => k.id === s));
  const bySkill = known.map((s) => DAILY.filter((id) => QUESTS[id] && QUESTS[id].skill === s));
  const out = [];
  for (let round = 0; out.length < max && bySkill.some((list) => list.length > round); round++) {
    for (const list of bySkill) if (list[round] && out.length < max) out.push(list[round]);
  }
  return out;
}
