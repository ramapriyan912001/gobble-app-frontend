export const FOOD_IMAGES_URIs = {
    "Indian": 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/icons%2FIndian.jpg?alt=media&token=f400ee28-730a-43ca-8097-9959ae719e3b',
    "Western": 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/icons%2FWestern.jpg?alt=media&token=6f3d75a1-3441-42b1-a8bd-86f8058bc30c',
    'Asian': 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/icons%2FAsian.jpg?alt=media&token=42a2bb66-5128-40b3-bbdf-90a3a08f0050',
    'Any': 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/icons%2FAnyCuisine.jpg?alt=media&token=a81028e1-b1f7-466d-a7a6-426538d9d917'
}

export const INDUSTRY_CODES = {
    6: "Human Resources",
    2: "Law",
    3: "Research",
    4: "Engineering",
    0: "Computing",
    1: "Marketing",
    7: "Sales",
    8: "Artist",
    9: "Public Sector",
    10: "Medicine",
    5: "Shipping & Transportation",
    11: "Sports",
    12: "Others"
}

export const CUISINES = ['Western', 'Indian', 'Asian', 'Food Court', 'Any']
export const REASONS = ['Spam', 'Unprofessional', 'Harassment', 'Sexual Harassment', 'Others']

export const DIETS = ['Vegetarian', 'Strictly Vegetarian', 'Halal', 'Strictly Halal', 'Any']

export const EMPTY_AVATAR = 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc'
export const GOBBLE_IMAGE_URI = 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/icons%2Fadaptive-icon.png?alt=media&token=b3b418d2-6c37-4f0d-bcc7-5fd94abc615e'

export const QUESTIONS = [
  'What is the purpose of Gobble?',
  'What do the tabs at the bottom signify?',
  'What do I do?',
  'How sensitive is Gobble to privacy?',
  'When clicking the match in the matches tab, I see restaurants of all kinds, not just those of the particular cuisine I prefer.'
];
export const ANSWERS = [
  'Gobble is the world’s first meal-networking app! We offer professionals the chance to expand their networks over a meal, and foodies a chance to share their joy for various cuisines with others like themselves!',
  'From left, the first tab is the Profile tab, the second is the Gobble tab where you can make requests, the third is the Matches tab where you can see requests of yours that have not been matched, requests that have been matched but pending your confirmation, and matches that have been fixed upon confirmation from both parties.',
  'First, check that your Meal Preferences in your profile page are set to your preference. Next, move over to the Gobble tab and create a Gobble so that we can find you a partner for your meal! While we search for a partner for you, your Gobble will be displayed in the awaiting section of the matches tab. When a match is found, the details of this match will be displayed in the pending section of the matches tab. Now, it’s just down to you to accept and gobble!',
  'Gobble is very sensitive to matters of privacy. We are keenly aware that declining of matches could lead to souring of professional relationships, and as such, we have implemented a three layered approach to matching. The middle layer offers a chance for both parties to confirm if they want to match with each other, complete with the benefit of personal anonymity on both sides so that each user can take their decision free of any concern of professional insult.',
  'Yes, this is by design. We wish to give our Gobblers the chance to explore the various cuisine options in their area once a match is made.'
]

export const QUESTION_AND_ANSWER = [
  {
    'Question': 'What is the purpose of Gobble?',
    'Answer': 'Gobble is the world’s first meal-networking app! We offer professionals the chance to expand their networks over a meal, and foodies a chance to share their joy for various cuisines with others like themselves!'
  },
  {
    'Question': 'What do the tabs at the bottom signify?',
    'Answer': 'From left, the first tab is the Profile tab, the second is the Gobble tab where you can make requests, the third is the Matches tab where you can see requests of yours that have not been matched, requests that have been matched but pending your confirmation, and matches that have been fixed upon confirmation from both parties.'
  },
  {
    'Question': 'What do I do?',
    'Answer': 'First, check that your Meal Preferences in your profile page are set to your preference. Next, move over to the Gobble tab and create a Gobble so that we can find you a partner for your meal! While we search for a partner for you, your Gobble will be displayed in the awaiting section of the matches tab. When a match is found, the details of this match will be displayed in the pending section of the matches tab. Now, it’s just down to you to accept and gobble!'
  },
  {
    'Question': 'How sensitive is Gobble to privacy?',
    'Answer': 'Gobble is very sensitive to matters of privacy. We are keenly aware that declining of matches could lead to souring of professional relationships, and as such, we have implemented a three layered approach to matching. The middle layer offers a chance for both parties to confirm if they want to match with each other, complete with the benefit of personal anonymity on both sides so that each user can take their decision free of any concern of professional insult.'
  },
  {
    'Question': 'When clicking the match in the matches tab, I see restaurants of all kinds, not just those of the particular cuisine I prefer.',
    'Answer': 'Yes, this is by design. We wish to give our Gobblers the chance to explore the various cuisine options in their area once a match is made.'
  }
]

export const MAP_DARK_MODE = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ]
