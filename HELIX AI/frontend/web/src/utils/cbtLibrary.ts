import { CBTExercise, EmotionState, EmotionKey } from '../types';

export const cbtExercises: CBTExercise[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'A simple technique to regain control of your breath and calm your nervous system.',
    targetEmotion: 'Fear',
    minIntensity: 2,
    steps: [
      'Inhale through your nose for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Exhale through your mouth for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Repeat 4 times.'
    ],
    interactiveSteps: [
      { text: 'Inhale deeply through your nose...', duration: 4, type: 'inhale' },
      { text: 'Hold your breath...', duration: 4, type: 'hold' },
      { text: 'Exhale slowly through your mouth...', duration: 4, type: 'exhale' },
      { text: 'Hold...', duration: 4, type: 'hold' },
      { text: 'Inhale again...', duration: 4, type: 'inhale' },
      { text: 'Hold...', duration: 4, type: 'hold' },
      { text: 'Release...', duration: 4, type: 'exhale' },
      { text: 'Hold...', duration: 4, type: 'hold' }
    ]
  },
  {
    id: '5-4-3-2-1',
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to anchor yourself in the present moment.',
    targetEmotion: 'Fear',
    minIntensity: 3,
    steps: [
      'Acknowledge 5 things you see around you.',
      'Acknowledge 4 things you can touch.',
      'Acknowledge 3 things you hear.',
      'Acknowledge 2 things you can smell.',
      'Acknowledge 1 thing you can taste.'
    ],
    interactiveSteps: [
      { text: 'Let\'s start. Name 5 things you can see around you right now.', duration: 8, type: 'action' },
      { text: 'Good. Now, what are 4 things you can touch or feel?', duration: 8, type: 'action' },
      { text: 'Next, listen closely. What are 3 things you can hear?', duration: 6, type: 'action' },
      { text: 'Almost there. What are 2 things you can smell?', duration: 5, type: 'action' },
      { text: 'Finally, name 1 thing you can taste, or your favorite taste.', duration: 5, type: 'action' },
      { text: 'Well done. Take one last deep breath and notice how you feel.', duration: 5, type: 'inhale' }
    ]
  },
  {
    id: 'behavioral-activation',
    title: 'Behavioral Activation',
    description: 'Combat sadness by engaging in a small, manageable positive activity.',
    targetEmotion: 'Sadness',
    minIntensity: 2,
    steps: [
      'Identify one small task you can do right now (e.g., make tea, stretch).',
      'Do it mindfully, focusing on the sensations.',
      'Notice how you feel after completing it.'
    ]
  },
  {
    id: 'cognitive-reframing',
    title: 'Cognitive Reframing',
    description: 'Challenge negative thought patterns.',
    targetEmotion: 'Anger',
    minIntensity: 2,
    steps: [
      'Identify the triggering thought.',
      'Ask: Is this thought 100% true?',
      'Ask: Is there another way to look at this situation?',
      'Formulate a more balanced thought.'
    ]
  },
  {
    id: 'gratitude-scan',
    title: 'Gratitude Scan',
    description: 'Shift focus from lack to abundance.',
    targetEmotion: 'Sadness',
    minIntensity: 1,
    steps: [
      'Take a deep breath.',
      'Name three things, no matter how small, that you are grateful for today.',
      'Allow yourself to feel a moment of appreciation for each.'
    ]
  },
  {
    id: 'reality-testing',
    title: 'Reality Testing',
    description: 'Evaluate the evidence for and against your current feelings.',
    targetEmotion: 'Surprise',
    minIntensity: 3,
    steps: [
      'What is the evidence that supports this feeling?',
      'What is the evidence that contradicts it?',
      'What would I tell a friend in this situation?'
    ]
  },
  {
    id: 'savoring',
    title: 'Savoring the Moment',
    description: 'Deepen the experience of positive emotions.',
    targetEmotion: 'Joy',
    minIntensity: 2,
    steps: [
      'Stop and focus on the positive feeling you are experiencing.',
      'Where do you feel it in your body?',
      'Take a mental snapshot of this moment.',
      'Share this feeling with someone if you can.'
    ]
  }
];

export const getIntensityLevel = (value: number): number => {
  // Value is 0.0 to 1.0. Map to 1-5 scale.
  if (value < 0.2) return 1;
  if (value < 0.4) return 2;
  if (value < 0.6) return 3;
  if (value < 0.8) return 4;
  return 5;
};

export const suggestCBTExercise = (emotions: EmotionState): CBTExercise | null => {
  let dominantEmotion: EmotionKey | '' = '';
  let maxVal = -1;

  (Object.keys(emotions) as Array<EmotionKey>).forEach(key => {
    if (emotions[key] > maxVal) {
      maxVal = emotions[key];
      dominantEmotion = key;
    }
  });

  if (!dominantEmotion || maxVal < 0.2) return null; // No strong emotion

  const intensityLevel = getIntensityLevel(maxVal);

  // Filter exercises: Must match emotion, and the emotion intensity must be high enough to warrant the exercise.
  const candidates = cbtExercises.filter(ex =>
    ex.targetEmotion === dominantEmotion && intensityLevel >= ex.minIntensity
  );

  if (candidates.length === 0) return null;

  // Return random candidate if multiple
  return candidates[Math.floor(Math.random() * candidates.length)];
};