export interface NodeTranslation {
  label: string;
  who: string;
  doing: string;
  outputLabel: string;
}

export const NODE_TRANSLATIONS: Record<string, { en: NodeTranslation; hi: NodeTranslation }> = {
  'cotton-farm': {
    en: {
      label: 'Cotton Farm',
      who: 'Ramesh, a cotton farmer',
      doing: 'Grows cotton plants using soil, rain, and sunshine.',
      outputLabel: 'Raw Cotton Pods'
    },
    hi: {
      label: 'कपास का खेत',
      who: 'रमेश, एक कपास किसान',
      doing: 'मिट्टी, बारिश और धूप की मदद से कपास की फसल उगाता है।',
      outputLabel: 'कच्चा कपास'
    }
  },
  'dairy-farm': {
    en: {
      label: 'Dairy Farm',
      who: 'Sunita, a dairy farmer',
      doing: 'Feeds dairy cows and collects fresh milk every morning.',
      outputLabel: 'Raw Fresh Milk'
    },
    hi: {
      label: 'डेयरी फार्म',
      who: 'सुनीता, एक पशुपालक',
      doing: 'गायों को चारा खिलाती है और हर सुबह ताजा दूध निकालती है।',
      outputLabel: 'ताजा कच्चा दूध'
    }
  },
  'timber-forest': {
    en: {
      label: 'Timber Forest',
      who: 'Birju, a forest worker',
      doing: 'Gathers fallen timber logs carefully from the woodland.',
      outputLabel: 'Wood Logs'
    },
    hi: {
      label: 'इमारती लकड़ी का वन',
      who: 'बिरजू, वन कर्मी',
      doing: 'जंगल से सूखी व मजबूत लकड़ी के लट्ठे एकत्रित करता है।',
      outputLabel: 'लकड़ी के लट्ठे'
    }
  },
  'textile-mill': {
    en: {
      label: 'Textile Mill',
      who: 'Anand, a mill worker',
      doing: 'Spins raw cotton into yarn and weaves it into cloth.',
      outputLabel: 'Woven Cotton Cloth'
    },
    hi: {
      label: 'कपड़ा मिल',
      who: 'आनंद, मिल कारीगर',
      doing: 'कच्चे कपास से धागा कातकर सुंदर सूती कपड़ा बुनता है।',
      outputLabel: 'सूती कपड़ा व कमीज'
    }
  },
  'dairy-plant': {
    en: {
      label: 'Dairy Plant',
      who: 'Meera, a dairy technician',
      doing: 'Boils, cools, and packs milk into clean sealed pouches.',
      outputLabel: 'Packaged Milk'
    },
    hi: {
      label: 'दूध प्रसंस्करण संयंत्र',
      who: 'मीरा, डेयरी तकनीशियन',
      doing: 'दूध को उबालकर कीटाणुरहित करती है और थैलियों में पैक करती है।',
      outputLabel: 'पैकेटबंद दूध'
    }
  },
  'furniture-workshop': {
    en: {
      label: 'Furniture Workshop',
      who: 'Dev, a carpenter',
      doing: 'Cuts, smoothes, and crafts timber logs into sturdy desks.',
      outputLabel: 'Wooden School Desks'
    },
    hi: {
      label: 'फर्नीचर कार्यशाला',
      who: 'देव, एक बढ़ई',
      doing: 'लकड़ी को काटकर, तराशकर स्कूल के लिए मजबूत डेस्क बनाता है।',
      outputLabel: 'लकड़ी की मेज व डेस्क'
    }
  },
  'transport-truck': {
    en: {
      label: 'Transport Truck',
      who: 'Jaspreet, a truck driver',
      doing: 'Carries materials and finished goods along highway routes.',
      outputLabel: 'Freight Delivery Service'
    },
    hi: {
      label: 'परिवहन ट्रक',
      who: 'जसप्रीत, ट्रक चालक',
      doing: 'कच्चे माल और तैयार सामान को राजमार्गों द्वारा गंतव्य तक पहुंचाता है।',
      outputLabel: 'माल ढुलाई सेवा'
    }
  },
  'bazaar-shop': {
    en: {
      label: 'Bazaar Market Shop',
      who: 'Laxmi, a shopkeeper',
      doing: 'Stocks shelves and sells finished goods to neighbourhood shoppers.',
      outputLabel: 'Retail Counter Service'
    },
    hi: {
      label: 'बाजार की दुकान',
      who: 'लक्ष्मी, एक दुकानदार',
      doing: 'सामान को दुकान में सजाती है और ग्राहकों को बेचती है।',
      outputLabel: 'खुदरा बिक्री सेवा'
    }
  },
  'cooperative-bank': {
    en: {
      label: 'Cooperative Bank',
      who: 'Priya, a bank loan officer',
      doing: 'Offers affordable loans so farmers and factories can buy equipment.',
      outputLabel: 'Financial Credit Service'
    },
    hi: {
      label: 'सहकारी बैंक',
      who: 'प्रिया, ऋण अधिकारी',
      doing: 'किसानों और मिलों को मशीनें व बीज खरीदने हेतु ऋण देती है।',
      outputLabel: 'बैंकिंग व ऋण सेवा'
    }
  },
  'consumer-household': {
    en: {
      label: 'Consumer Household',
      who: 'Anita & Family, consumers',
      doing: 'Buys and uses finished goods to meet everyday family needs.',
      outputLabel: 'End Consumer Demand'
    },
    hi: {
      label: 'उपभोक्ता परिवार',
      who: 'अनीता और उनका परिवार',
      doing: 'अपनी दैनिक जरूरतों के लिए तैयार सामान खरीदकर उपयोग करते हैं।',
      outputLabel: 'उपभोक्ता मांग'
    }
  }
};

export const UI_TRANSLATIONS = {
  en: {
    sectors: {
      all: 'All Sectors',
      primary: 'Primary (Nature)',
      secondary: 'Secondary (Making)',
      tertiary: 'Tertiary (Services)'
    },
    flowMode: {
      goods: '📦 Goods & Services Flow',
      money: '💰 Money & Wages Flow (₹)',
      bannerGoods: 'Goods & raw materials flow forward from Nature through Factories to the Consumer.',
      bannerMoney: 'Money flows backwards: When consumers buy goods (₹), it pays factory wages, transport fuel, and farmer income!'
    },
    card: {
      worker: 'Worker Role',
      activity: 'Economic Action',
      output: 'Economic Output',
      good: 'Tangible Good',
      service: 'Helpful Service',
      readAloud: 'Read Aloud',
      stopAudio: 'Stop Audio'
    },
    stops: {
      explore: 'Explore Map',
      'follow-product': 'Follow Product',
      'what-if': 'What-If Lab',
      'fix-economy': 'Fix Economy',
      'final-challenge': 'Chain Builder',
      assessment: 'Assessment',
      results: 'Results'
    },
    sandbox: {
      title: 'Economy Sandbox Simulator',
      subtitle: 'Test how weather, fuel prices, and market demand create ripple effects across the entire economic machine.',
      rainfall: 'Monsoon Rainfall',
      fuel: 'Diesel & Fuel Price',
      demand: 'Consumer Demand',
      agricultureHealth: 'Agriculture & Raw Materials',
      industrialOutput: 'Factory & Mill Output',
      marketPrice: 'Shop Price Stability',
      reset: 'Reset Dials',
      insightTitle: 'Economic Cause & Effect',
      lowRain: 'Severe drought reduces cotton and milk harvest by 50%. Raw material scarcity drives up farmgate prices.',
      highFuel: 'Expensive diesel makes highway truck transport costly. Consumer goods in city bazaars become more expensive.',
      highDemand: 'Surge in festival shoppers strains textile factories and creates product shortages in retail shops.'
    },
    certificate: {
      button: 'Claim Junior Economist Certificate',
      title: 'CERTIFICATE OF ACHIEVEMENT',
      subtitle: 'Class 6 Social Science · Chapter 14: Economic Activities Around Us',
      presentedTo: 'This is proudly presented to',
      namePlaceholder: 'Enter your full name...',
      body: 'for demonstrating exceptional economic reasoning, understanding sector interdependence (Primary, Secondary, Tertiary), and tracing the circular flow of goods and money.',
      scoreLabel: 'Final Mastery Score',
      dateLabel: 'Date Awarded',
      sealLabel: 'NCERT Curriculum Verified',
      teacherSignature: 'Teacher / Evaluator Signature',
      printBtn: 'Print / Save PDF Certificate',
      closeBtn: 'Close'
    }
  },
  hi: {
    sectors: {
      all: 'सभी क्षेत्र',
      primary: 'प्राथमिक (प्रकृति)',
      secondary: 'द्वितीयक (विनिर्माण)',
      tertiary: 'तृतीयक (सेवाएं)'
    },
    flowMode: {
      goods: '📦 वस्तु व सेवा प्रवाह',
      money: '💰 धन व मजदूरी प्रवाह (₹)',
      bannerGoods: 'वस्तुएं और कच्चा माल प्रकृति से कारखानों और फिर बाजार से होते हुए उपभोक्ता तक पहुंचते हैं।',
      bannerMoney: 'धन उल्टी दिशा में बहता है: उपभोक्ता जब सामान खरीदता है (₹), तो उसी पैसे से कारीगरों को वेतन, ट्रांसपोर्ट को किराया और किसान को आमदनी मिलती है!'
    },
    card: {
      worker: 'श्रमिक की भूमिका',
      activity: 'आर्थिक गतिविधि',
      output: 'आर्थिक उत्पादन',
      good: 'मूर्त वस्तु (Good)',
      service: 'सहयोगी सेवा (Service)',
      readAloud: 'बोलकर सुनें',
      stopAudio: 'आवाज रोकें'
    },
    stops: {
      explore: 'मानचित्र अन्वेषण',
      'follow-product': 'उत्पाद यात्रा',
      'what-if': 'क्या होगा अगर?',
      'fix-economy': 'कड़ियां जोड़ें',
      'final-challenge': 'श्रृंखला निर्माता',
      assessment: 'मूल्यांकन',
      results: 'परिणाम'
    },
    sandbox: {
      title: 'अर्थव्यवस्था सैंडबॉक्स सिम्युलेटर',
      subtitle: 'जांचें कि बारिश, ईंधन के दाम और बाजार की मांग पूरी आर्थिक व्यवस्था में कैसे लहरें पैदा करते हैं।',
      rainfall: 'मानसून की वर्षा',
      fuel: 'डीजल व ईंधन का दाम',
      demand: 'उपभोक्ता बाजार मांग',
      agricultureHealth: 'कृषि व कच्चा माल',
      industrialOutput: 'कारखाने व उत्पादन',
      marketPrice: 'दुकान मूल्य स्थिरता',
      reset: 'डायल रीसेट करें',
      insightTitle: 'आर्थिक कारण व प्रभाव',
      lowRain: 'सूखे के कारण कपास और दूध के उत्पादन में भारी कमी आती है, जिससे कच्चे माल की कीमतें बढ़ जाती हैं।',
      highFuel: 'महंगे डीजल से ट्रकों का भाड़ा बढ़ता है, जिससे शहर की दुकानों में सामान महंगा हो जाता है।',
      highDemand: 'त्योहारों में अचानक भारी मांग से मिलों पर दबाव बढ़ता है और दुकानों में स्टॉक खत्म होने लगता है।'
    },
    certificate: {
      button: 'जूनियर इकोनॉमिस्ट प्रमाणपत्र प्राप्त करें',
      title: 'उपलब्धि प्रमाणपत्र',
      subtitle: 'कक्षा 6 सामाजिक विज्ञान · अध्याय 14: हमारे आस-पास की आर्थिक गतिविधियां',
      presentedTo: 'यह प्रमाणपत्र गर्वपूर्वक प्रदान किया जाता है',
      namePlaceholder: 'अपना पूरा नाम दर्ज करें...',
      body: 'को, जिन्होंने प्राथमिक, द्वितीयक और तृतीयक क्षेत्रों की परस्पर निर्भरता तथा वस्तुओं और धन के चक्रीय प्रवाह को उत्कृष्ट रूप से समझा और प्रमाणित किया।',
      scoreLabel: 'अंतिम प्राप्तांक',
      dateLabel: 'प्रमाणन तिथि',
      sealLabel: 'एनसीईआरटी पाठ्यक्रम प्रमाणित',
      teacherSignature: 'शिक्षक / परीक्षक हस्ताक्षर',
      printBtn: 'प्रमाणपत्र प्रिंट / PDF सेव करें',
      closeBtn: 'बंद करें'
    }
  }
};
