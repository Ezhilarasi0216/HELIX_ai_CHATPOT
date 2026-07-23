# Keywords that trigger high risk alerts
CRISIS_KEYWORDS = [
    "suicide", "kill myself", "end my life", "die", "death",
    "hurt myself", "self-harm", "cut myself", "overdose",
    "jump off", "hang myself", "want to die"
]

# Keywords for medium risk
WARNING_KEYWORDS = [
    "depressed", "hopeless", "worthless", "nobody cares",
    "alone", "lonely", "darkness", "pain", "suffering",
    "can't go on", "tired of everything"
]

# Helper safe words that might negate risk (simple implementation)
SAFE_CONTEXT_WORDS = [
    "not", "don't", "never", "movie", "book", "song", "joke"
]
