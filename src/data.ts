import { EnemyStats } from "./types";
import cRookie from "./assets/images/c_rookie_1782048505782.jpg";
import cContender from "./assets/images/c_contender_1782048540281.jpg";
import cAmateur from "./assets/images/c_amateur_1782048522826.jpg";
import cFinalBoss from "./assets/images/c_finalboss_1782048554619.jpg";

export const enemies: Record<string, EnemyStats> = {
  rookie: {
    name: "Street Rookie",
    stamina: 40,
    maxStamina: 40,
    power: 5,
    speed: 15,
    key: "rookie",
    image: cRookie,
  },
  contender: {
    name: "Campus Contender",
    stamina: 75,
    maxStamina: 75,
    power: 8,
    speed: 18,
    key: "contender",
    image: cContender,
  },
  heavyweight: {
    name: "Amateur Heavyweight",
    stamina: 90,
    maxStamina: 90,
    power: 10,
    speed: 20,
    key: "heavyweight",
    image: cAmateur,
  },
  champion: {
    name: "Review Champion",
    stamina: 130,
    maxStamina: 130,
    power: 15,
    speed: 30,
    key: "champion",
    image: cFinalBoss,
  },
};

export const activity1Questions = [
  {
    id: 1,
    question: "Regular exercise can improve both physical and mental health.",
    answer: "Just right",
  },
  {
    id: 2,
    question: "Technology affects people's lives in many ways.",
    answer: "Too general",
  },
  {
    id: 3,
    question: "Last Saturday at 7:30 a.m., my cousin used a blue smartphone to order fried rice from a food delivery app while sitting on a red sofa.",
    answer: "Too specific",
  },
  {
    id: 4,
    question: "Food is important for everyone.",
    answer: "Too general",
  },
  {
    id: 5,
    question: "The small coffee shop near my house sells chocolate cake with strawberry toppings for Rp18,000 every Friday afternoon.",
    answer: "Too specific",
  },
  {
    id: 6,
    question: "Learning English through movies can help students improve their listening skills.",
    answer: "Just right",
  },
  {
    id: 7,
    question: "Social media can influence teenagers’ communication habits.",
    answer: "Just right",
  },
  {
    id: 8,
    question: "During yesterday’s school break, Tina bought two cheese sandwiches and one orange juice from the school cafeteria.",
    answer: "Too specific",
  },
  {
    id: 9,
    question: "Education plays an important role in society.",
    answer: "Too general",
  },
  {
    id: 10,
    question: "Reading books regularly can help students expand their vocabulary.",
    answer: "Just right",
  },
];

export const activity2Questions = [
  {
    id: 1,
    question: "Prepare ahead in order to have a successful garage sale.",
    answer: "topic",
  },
  {
    id: 2,
    question: "First, collect used items in good condition and clean them well.",
    answer: "supporting",
  },
  {
    id: 3,
    question: "If you follow all of these steps, your garage sale will be a great success.",
    answer: "concluding",
  },
  {
    id: 4,
    question: "Digital cameras have several advantages over film cameras.",
    answer: "topic",
  },
  {
    id: 5,
    question: "For example, the bride often wears a long white holoku (wedding dress).",
    answer: "supporting",
  },
  {
    id: 6,
    question: "All in all, a Hawaiian wedding is truly a magical, multicultural event.",
    answer: "concluding",
  },
  {
    id: 7,
    question: "Indeed, every type of person can find enjoyment at a beach.",
    answer: "concluding",
  },
  {
    id: 8,
    question: "The average age for people in the U.S. to marry has changed in the past 100 years.",
    answer: "topic",
  },
  {
    id: 9,
    question: "A third advantage of living in zoos is that sick animals get prompt medical attention.",
    answer: "supporting",
  },
  {
    id: 10,
    question: "Finally, get up early on the morning of the sale and arrange the items on tables.",
    answer: "supporting",
  },
];

export const activity3Questions = [
  {
    id: 1,
    question: "The woman ________ teaches our English class is very friendly.",
    options: ["who", "where", "which", "whose"],
    answer: "A",
  },
  {
    id: 2,
    question: "I have a classmate ________ always arrives early at school.",
    options: ["who", "whom", "where", "when"],
    answer: "A",
  },
  {
    id: 3,
    question: "The book ________ I borrowed from the library is very interesting.",
    options: ["where", "whom", "that", "when"],
    answer: "C",
  },
  {
    id: 4,
    question: "Students usually enjoy lessons ________ make learning more fun.",
    options: ["where", "whose", "that", "why"],
    answer: "C",
  },
  {
    id: 5,
    question: "This is the restaurant ________ my family had dinner last night.",
    options: ["whom", "whose", "who", "where"],
    answer: "D",
  },
  {
    id: 6,
    question: "The boy ________ bicycle was stolen reported it to the teacher.",
    options: ["whom", "whose", "where", "which"],
    answer: "B",
  },
  {
    id: 7,
    question: "The teacher ________ helped me understand grammar is very patient.",
    options: ["who", "whose", "where", "when"],
    answer: "A",
  },
  {
    id: 8,
    question: "The day ________ we had our school trip was very exciting.",
    options: ["who", "whom", "when", "whose"],
    answer: "C",
  },
  {
    id: 9,
    question: "I do not know the reason ________ she was absent yesterday.",
    options: ["whom", "where", "why", "whose"],
    answer: "C",
  },
  {
    id: 10,
    question: "The student ________ I talked to after class was very helpful.",
    options: ["where", "whom", "which", "when"],
    answer: "B",
  },
];

export const activity4Questions = [
  {
    id: 1,
    question: "The committee accepted the researcher 's proposal after several rounds of revision.",
    answer: true,
  },
  {
    id: 2,
    question: "The students' presentations demonstrated a remarkable understanding of environmental issues.",
    answer: true,
  },
  {
    id: 3,
    question: "Several scientist's opinions were included in the final report.",
    answer: false,
  },
  {
    id: 4,
    question: "The company's expansion strategy significantly increased its international market share.",
    answer: true,
  },
  {
    id: 5,
    question: "The manager explained that the employees' responsibilities would change after the merger.",
    answer: true,
  },
  {
    id: 6,
    question: "The teacher praised the childrens' creativity during the project exhibition.",
    answer: false,
  },
  {
    id: 7,
    question: "Everyone admired James' ability to solve complex mathematical problems quickly.",
    answer: true,
  },
  {
    id: 8,
    question: "The universities 's policies were revised to improve academic standards.",
    answer: false,
  },
  {
    id: 9,
    question: "The author's interpretation of the historical event differed from previous studies.",
    answer: true,
  },
  {
    id: 10,
    question: "The engineers' innovative designs received international recognition.",
    answer: true,
  },
];

export const activity5Questions = [
  {
    id: 1,
    jumbled: ["studies", "The", "who", "passes.", "student"],
    correct: "The student who studies passes.",
  },
  {
    id: 2,
    jumbled: ["met", "kind.", "is", "The", "whom", "man", "I"],
    correct: "The man whom I met is kind.",
  },
  {
    id: 3,
    jumbled: ["is", "my", "running", "boy", "brother.", "who", "The", "is"],
    correct: "The boy who is running is my brother.",
  },
  {
    id: 4,
    jumbled: ["read", "The", "was", "book", "interesting.", "that", "I"],
    correct: "The book that I read was interesting.",
  },
  {
    id: 5,
    jumbled: ["met", "where", "café", "is", "quiet.", "The", "we"],
    correct: "The café where we met is quiet.",
  },
  {
    id: 6,
    jumbled: ["rainy.", "met", "was", "The", "we", "when", "day"],
    correct: "The day when we met was rainy.",
  },
  {
    id: 7,
    jumbled: ["Monday.", "when", "test", "we", "was", "had", "The", "day", "the"],
    correct: "The day when we had the test was Monday.",
  },
  {
    id: 8,
    jumbled: ["red", "bag", "The", "is", "smiles.", "whose", "girl"],
    correct: "The girl whose bag is red smiles.",
  },
  {
    id: 9,
    jumbled: ["study", "is", "room", "where", "The", "quiet.", "we"],
    correct: "The room where we study is quiet.",
  },
  {
    id: 10,
    jumbled: ["yesterday,", "My", "which", "new", "broke.", "cell phone,", "I", "got"],
    correct: "My new cell phone, which I got yesterday, broke.",
  },
];

export const activity6Questions = [
  {
    id: 1,
    topic: "Cooking Noodles",
    top: "It is easy to cook delicious noodles by following these instructions.",
    steps: [
      "First, boil a large pot of water on the stove.",
      "Second, put the noodles in the water until soft.",
      "Then, drain the liquid and add seasonings.",
    ],
    bottom: "You are now ready to enjoy a perfect bowl of noodles.",
  },
  {
    id: 2,
    topic: "Garage Sale",
    top: "Prepare ahead in order to have a successful garage sale.",
    steps: [
      "First, collect used items in good condition.",
      "Second, mark a price on each item.",
      "Then, make advertising signs for your neighborhood.",
    ],
    bottom: "If you follow these steps, your sale will be a success.",
  },
  {
    id: 3,
    topic: "Designer Jeans",
    top: "Follow these easy steps to make your own pair of designer jeans.",
    steps: [
      "First, rub a knife or cheese grater against the denim.",
      "Second, use a toothbrush and bleach to fade the pockets.",
      "Then, wash and dry the jeans several times.",
    ],
    bottom: "Your new jeans will look stylishly old and unique.",
  },
  {
    id: 4,
    topic: "Jet Lag",
    top: "Frequent flyers recommend these steps to prevent jet lag.",
    steps: [
      "First, eat a high-carbohydrate meal before your flight.",
      "Second, avoid drinking alcohol or coffee in the air.",
      "Then, go to bed early on your first night abroad.",
    ],
    bottom: "These simple steps will help you stay energized.",
  },
  {
    id: 5,
    topic: "Paragraph Writing",
    top: "You can build a perfect paragraph by following the writing process.",
    steps: [
      "First, prewrite to get ideas using a cluster or list.",
      "Second, write a rough first draft on paper.",
      "Then, edit your work for grammar and organization.",
    ],
    bottom: "This process ensures your academic writing is clear.",
  },
  {
    id: 6,
    topic: "Waxing a Car",
    top: "Keep your car looking great by following these steps to wax it.",
    steps: [
      "First, wash and dry the car thoroughly in the shade.",
      "Second, rub the wax into the paint in small circles.",
      "Then, polish the surface with a soft cloth for a shine.",
    ],
    bottom: "Your car will look brand new if you follow this routine.",
  },
  {
    id: 7,
    topic: "Merging Sentences",
    top: "Follow these three steps to combine sentences with adjective clauses.",
    steps: [
      "First, find the noun that is repeated in both sentences.",
      "Second, pick a relative word like \"who\" or \"which.\"",
      "Then, delete the repeated noun and merge the clauses.",
    ],
    bottom: "These steps help you write complex sentences correctly.",
  },
  {
    id: 8,
    topic: "Cleaning a House",
    top: "Follow this plan to clean up your house quickly after a party.",
    steps: [
      "First, carry all the empty bottles and cans to the trash.",
      "Second, wash the dirty dishes and clean the tables.",
      "Then, vacuum the carpet to remove any remaining dirt.",
    ],
    bottom: "Your home will be spotless in no time at all.",
  },
  {
    id: 9,
    topic: "Library Research",
    top: "It is simple to find the right book by taking these steps.",
    steps: [
      "First, use the library computer to find the book's title.",
      "Second, locate the correct shelf in the stacks.",
      "Then, take the book to the front desk to check it out.",
    ],
    bottom: "You now have the information you need for your report.",
  },
  {
    id: 10,
    topic: "Teaching License",
    top: "A person must meet several requirements to receive a teaching license.",
    steps: [
      "First, take several college courses in your subject.",
      "Second, pass a written test for every subject you teach.",
      "Then, spend at least one year practice-teaching.",
    ],
    bottom: "Only after these steps is a teacher ready for the classroom.",
  },
];

export const activity7Questions = [
  { signal: "All in all", category: "Needs Comma", info: "Conclusion Signal" },
  { signal: "It is clear that", category: "No Comma", info: "Conclusion Signal" },
  { signal: "First", category: "Needs Comma", info: "Time-Order Signal" },
  { signal: "Then", category: "No Comma", info: "The \"Special Exception\"" },
  { signal: "For example", category: "Needs Comma", info: "Example Signal" },
  { signal: "Such as", category: "No Comma", info: "Mid-sentence Signal" },
  { signal: "To sum up", category: "Needs Comma", info: "Conclusion Signal" },
  { signal: "In conclusion", category: "Needs Comma", info: "Conclusion Signal" },
  { signal: "Next", category: "Needs Comma", info: "Time-Order Signal" },
  { signal: "You can see that", category: "No Comma", info: "Conclusion Signal" },
];

export const activity8Questions = [
  {
    id: 1,
    topic: "Digital cameras provide several advantages for people who enjoy photography.",
    options: [
      "Digital cameras are very useful for many people today.",
      "Many photographers prefer traveling to mountain areas during holidays.",
      "Digital cameras allow users to instantly review and delete poor-quality photos before printing them.",
    ],
    answer: "C",
  },
  {
    id: 2,
    topic: "Regular exercise can improve a person's mental health.",
    options: [
      "Studies show that exercise can reduce stress levels and increase the release of mood-improving chemicals in the brain.",
      "Athletes often wear specially designed shoes during competitions.",
      "Exercise is good for health and many people should do it.",
    ],
    answer: "A",
  },
  {
    id: 3,
    topic: "A strong topic sentence helps organize a paragraph effectively.",
    options: [
      "Topic sentences are important in writing paragraphs.",
      "Students sometimes listen to music while studying in the library.",
      "A clear topic sentence introduces the main idea and guides the supporting details that follow.",
    ],
    answer: "C",
  },
  {
    id: 4,
    topic: "Paramedics need excellent decision-making skills in emergency situations.",
    options: [
      "Paramedics often must quickly decide the best treatment while patients require immediate medical attention.",
      "Hospitals usually provide cafeterias for visitors and staff members.",
      "Paramedics have many important responsibilities.",
    ],
    answer: "A",
  },
  {
    id: 5,
    topic: "Preparing instant noodles requires following several basic steps.",
    options: [
      "Cooking noodles is a common daily activity.",
      "First, boil water, add the noodles, and mix the seasoning after cooking.",
      "Many people enjoy watching cooking competitions on television.",
    ],
    answer: "B",
  },
  {
    id: 6,
    topic: "Teachers should develop strong communication skills in the classroom.",
    options: [
      "Teachers play an important role in education.",
      "Some schools organize annual sports competitions for students.",
      "Effective communication helps teachers explain complex concepts clearly to students.",
    ],
    answer: "C",
  },
  {
    id: 7,
    topic: "Technology has made communication faster and more efficient.",
    options: [
      "People can now send messages instantly through smartphones and online applications.",
      "Engineers often design environmentally friendly buildings.",
      "Technology changes modern life in many ways.",
    ],
    answer: "A",
  },
  {
    id: 8,
    topic: "Revising a paragraph improves the quality of academic writing.",
    options: [
      "Revision is important in the writing process.",
      "Universities usually have large parking areas for students.",
      "During revision, writers can correct grammar mistakes and strengthen weak supporting details.",
    ],
    answer: "C",
  },
  {
    id: 9,
    topic: "Holding a garage sale can help people reduce unnecessary clutter at home.",
    options: [
      "Families can sell unused items such as old books, clothes, and furniture to create more space.",
      "Gardening is a relaxing activity for many homeowners.",
      "Garage sales can be useful for people.",
    ],
    answer: "A",
  },
  {
    id: 10,
    topic: "Regular physical activity can increase a person's energy level throughout the day.",
    options: [
      "Doctors often work long shifts in hospitals during weekends.",
      "Exercise improves blood circulation, allowing more oxygen to reach body tissues efficiently.",
      "Exercise provides many benefits to people.",
    ],
    answer: "B",
  },
];

export const activity9Questions = [
  "It is simple to cook a delicious bowl of noodles by following these easy steps.", // Type: Topic Sentence
  "First, fill a large pot with two liters of water and bring it to a boil.", // Support 1
  "Second, add the dry noodles to the bubbling water carefully.", // Support 2
  "Then stir the noodles with a wooden spoon so they do not stick to the pot.", // Support 3
  "Next, allow the noodles to cook for eight to ten minutes until they are soft.", // Support 4
  "After that, drain the hot water into a sink using a large colander.", // Support 5
  "In addition, you may add a teaspoon of oil to keep the noodles smooth.", // Support 6
  "Finally, toss the noodles with seasonings, such as salt and pepper, for extra flavor.", // Support 7
  "You should serve them immediately while they are still steaming hot.", // Support 8
  "If you follow these instructions, you will have a perfect meal every time.", // Concluding Sentence
];

export const activity10Questions = [
  {
    id: 1,
    category: "Paragraph Structure",
    question: "What are the three essential parts that make up a formal academic paragraph?",
    options: [
      "Introduction, Body, and Conclusion",
      "Header, Main Details, and Footer",
      "Topic, Supporting, and Concluding sentences",
      "Opening, Evidence, and Closing",
    ],
    answer: "C",
  },
  {
    id: 2,
    category: "Topic Sentence Balance",
    question: "In the \"Balance Scale\" model, a strong topic sentence should be:",
    options: [
      "Neither too general nor too specific",
      "As broad as possible to cover many topics",
      "Highly specific with exact dates and names",
      "Always exactly ten words long",
    ],
    answer: "A",
  },
  {
    id: 3,
    category: "Adjective Clauses (Subject)",
    question: "Which relative word is used to combine sentences when the repeated noun is a person acting as the subject?",
    options: ["Which", "Where", "Who", "Whom"],
    answer: "C",
  },
  {
    id: 4,
    category: "Adjective Clauses (Object)",
    question: "\"The researcher ______ I met yesterday was very helpful.\" Which word correctly fills the object role?",
    options: ["Whom", "Who", "Which", "Whose"],
    answer: "A",
  },
  {
    id: 5,
    category: "Apostrophes (Possession)",
    question: "If you are referring to a club belonging to many students, what is the correct spelling?",
    options: [
      "The student's club",
      "The students' club",
      "The students club",
      "The studentss' club",
    ],
    answer: "B",
  },
  {
    id: 6,
    category: "Apostrophes (Contractions)",
    question: "Which of the following is used exclusively to show ownership or possession?",
    options: ["It's", "It is", "Its", "Its'"],
    answer: "C",
  },
  {
    id: 7,
    category: "Transition Signals",
    question: "Which time-order signal is the \"Special Exception\" that does NOT require a comma?",
    options: ["Then", "First", "Next", "Finally"],
    answer: "A",
  },
  {
    id: 8,
    category: "Paragraph Unity",
    question: "What is the \"Golden Rule\" of Unity in academic writing?",
    options: [
      "Every sentence must have an adjective clause",
      "A paragraph must contain exactly ten sentences",
      "All sentences must relate to one main idea",
      "The topic sentence must be the longest sentence",
    ],
    answer: "C",
  },
  {
    id: 9,
    category: "Concluding Sentences",
    question: "According to the \"Paragraph Sandwich\" model, what should a concluding sentence NEVER do?",
    options: [
      "Introduce a new idea",
      "Summarize the main points",
      "Repeat the main idea in different words",
      "Use a conclusion signal like \"In brief\"",
    ],
    answer: "A",
  },
  {
    id: 10,
    category: "The Writing Process",
    question: "In the \"Boxing Scholar\" curriculum, an outline is best compared to which professional document?",
    options: ["A grocery list", "An architect's plan", "A classroom schedule", "A final exam answer sheet"],
    answer: "B",
  },
];
