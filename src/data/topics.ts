import type { Topic } from "@/types/sat-platform/topic"

export const readingTopics: Topic[] = [
  { id: 1, name: "Information and Ideas", description: "Topic 1" },
  { id: 2, name: "Craft and Structure", description: "Topic 2" },
  { id: 3, name: "Expression of Ideas", description: "Topic 3" },
  { id: 4, name: "Standard English Conventions", description: "Topic 4" },
]

export const mathTopics: Topic[] = [
  {
    id: 1,
    name: "Algebra",
    description: "Linear equations, functions, and inequalities",
    subtopics: [
      { id: 101, name: "Linear equations in one variable", description: "Solving equations with one unknown" },
      { id: 102, name: "Linear functions", description: "Working with linear functions" },
      { id: 103, name: "Linear equations in two variables", description: "Solving equations with two unknowns" },
      {
        id: 104,
        name: "Systems of two linear equations in two variables",
        description: "Solving systems of equations",
      },
      {
        id: 105,
        name: "Linear inequalities in one or two variables",
        description: "Solving and graphing inequalities",
      },
    ],
  },
  {
    id: 2,
    name: "Advanced Math",
    description: "Nonlinear functions, equations, and expressions",
    subtopics: [
      { id: 201, name: "Nonlinear functions", description: "Working with nonlinear functions" },
      {
        id: 202,
        name: "Nonlinear equations in one variable and systems of equations in two variables",
        description: "Solving nonlinear equations",
      },
      { id: 203, name: "Equivalent expressions", description: "Simplifying and manipulating expressions" },
    ],
  },
  {
    id: 3,
    name: "Problem-Solving and Data Analysis",
    description: "Ratios, percentages, statistics, and probability",
    subtopics: [
      {
        id: 301,
        name: "Ratios, rates, proportional relationships, and units",
        description: "Working with proportions",
      },
      { id: 302, name: "Percentages", description: "Calculating with percentages" },
      {
        id: 303,
        name: "One-variable data: Distributions and measures of center and spread",
        description: "Analyzing single variable data",
      },
      {
        id: 304,
        name: "Two-variable data: Models and scatterplots",
        description: "Analyzing relationships between variables",
      },
      { id: 305, name: "Probability and conditional probability", description: "Calculating probabilities" },
      { id: 306, name: "Inference from sample statistics and margin of error", description: "Statistical inference" },
      {
        id: 307,
        name: "Evaluating statistical claims: Observational studies and experiments",
        description: "Analyzing statistical methods",
      },
    ],
  },
  {
    id: 4,
    name: "Geometry and Trigonometry",
    description: "Area, volume, triangles, and circles",
    subtopics: [
      { id: 401, name: "Area and volume", description: "Calculating area and volume" },
      { id: 402, name: "Lines, angles, and triangles", description: "Working with geometric shapes" },
      { id: 403, name: "Right triangles and trigonometry", description: "Applying trigonometric concepts" },
      { id: 404, name: "Circles", description: "Working with circles and their properties" },
    ],
  },
]

