// ⚠️ TEMPLATE ↔ EDITOR: Αν αλλάξεις τα πεδία του Play (προσθήκη/αφαίρεση/τύπος),
// ενημέρωσε ΚΑΙ το `app/data/playSchema.ts` — ο editor (/admin/plays) παράγεται
// αυτόματα από εκείνο το σχήμα. Το σχήμα είναι η μοναδική πηγή για τη φόρμα.
export interface Play {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  categories: string[];
  /** Εποχή / γιορτή — π.χ. Χριστούγεννα, Πάσχα, Καλοκαίρι */
  season: string;
  /** Σχολικές βαθμίδες — Νηπιαγωγείο, Δημοτικό, Γυμνάσιο */
  grades: string[];
  /** Ηλικιακές ομάδες κοινού — π.χ. "Προσχολική (3–5)" */
  ageGroups: string[];
  /** Σε ποιους απευθύνεται — Ερασιτεχνικές ομάδες, Παιδιά */
  audiences: string[];
  image: string;
  heroImage: string;
  duration: string;
  /** Ηλικιακό εύρος για προβολή, π.χ. "5–12" */
  ageGroup: string;
  characters: number;
  author: string;
  pdfUrl?: string;
  youtubeVideoId?: string;
}

/**
 * Οι διαστάσεις κατηγοριοποίησης που οδηγούν το μενού "Κατηγορίες" και
 * το φιλτράρισμα στην αρχική σελίδα. Κάθε διάσταση αντιστοιχεί σε ένα
 * search param (π.χ. ?season=Χριστούγεννα).
 */
export interface TaxonomyDimension {
  /** Το όνομα του search param */
  param: 'category' | 'season' | 'grade' | 'age' | 'audience';
  /** Ετικέτα προς εμφάνιση */
  label: string;
  /** Το πεδίο του Play από το οποίο διαβάζουμε τις τιμές */
  field: keyof Pick<
    Play,
    'categories' | 'season' | 'grades' | 'ageGroups' | 'audiences'
  >;
}

export const taxonomy: TaxonomyDimension[] = [
  { param: 'season', label: 'Εποχή', field: 'season' },
  { param: 'grade', label: 'Τάξη', field: 'grades' },
  { param: 'age', label: 'Ηλικιακή ομάδα', field: 'ageGroups' },
  { param: 'audience', label: 'Κοινό', field: 'audiences' },
  { param: 'category', label: 'Είδος', field: 'categories' },
];

/**
 * Αρχικά δεδομένα (seed). Ο editor αποθηκεύει τις αλλαγές στο
 * `content/plays.json`· αν αυτό δεν υπάρχει, χρησιμοποιείται αυτό το seed.
 * Διάβασε πάντα τα «ζωντανά» έργα μέσω `readPlays()` από το plays-store.
 */
export const seedPlays: Play[] = [
  {
    id: 'xristougenniatiko-dentro',
    title: 'Το Χριστουγεννιάτικο Δέντρο στη Χώρα των Συναισθημάτων',
    description: `Τι γίνεται όταν τα συναισθήματα αποφασίσουν να στολίσουν Χριστουγεννιάτικο δέντρο; Χαρά, Λύπη, Θυμός, Φόβος και Έκπληξη βρίσκονται αντιμέτωπα με τη μεγαλύτερη αποστολή τους: να κάνουν τα Χριστούγεννα μαγικά για όλους! Σε αυτή την παράσταση τα παιδιά γνωρίζουν τα συναισθήματά τους μέσα από ένα εορταστικό ταξίδι γεμάτο μουσική, γέλιο και σκαμπανεβάσματα.

Μέσα από τις περιπέτειες των χαριτωμένων ηρώων, τα παιδιά μαθαίνουν ότι κάθε συναίσθημα έχει τη θέση του, ακόμα και τη μέρα των Χριστουγέννων. Μια παράσταση που συνδυάζει διασκέδαση με συναισθηματική ευφυΐα, ιδανική για σχολικές εκδηλώσεις και θεατρικές ομάδες.`,
    shortDescription:
      'Τα συναισθήματα ετοιμάζουν το Χριστουγεννιάτικο δέντρο σε μια παράσταση για τη Χαρά, τη Λύπη και τον Θυμό.',
    categories: ['Εορταστικό', 'Φαντασία', 'Μιούζικαλ'],
    season: 'Χριστούγεννα',
    grades: ['Νηπιαγωγείο', 'Δημοτικό'],
    ageGroups: ['Προσχολική (3–5)', 'Παιδική (6–9)', 'Προεφηβική (10–12)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/xristougenniatiko-dentro/thumbnail.jpg',
    heroImage: '/plays/xristougenniatiko-dentro/thumbnail.jpg',
    duration: '60 λεπ.',
    ageGroup: '5–12',
    characters: 10,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/xristougenniatiko-dentro/play.pdf',
  },
  {
    id: 'pagomena-xristougenna-1',
    title: 'Τα Παγωμένα Χριστούγεννα — Έκδοχη Α\'',
    description: `Η Κακιά Βασίλισσα του Χειμώνα αποφάσισε να κλέψει τα Χριστούγεννα για πάντα! Τα ξωτικά, οι νεράιδες και ο ίδιος ο Άγιος Βασίλης θα πρέπει να ενώσουν τις δυνάμεις τους για να σώσουν την πιο μαγική γιορτή του χρόνου.

Η Α' Έκδοχη της παράστασης είναι γραμμένη για μικτό θίασο νεράιδων και ξωτικών, ιδανική για ομάδες με μεγάλο αριθμό ηθοποιών. Μια περιπέτεια με αγωνία, γέλιο και τελικά το θρίαμβο της αγάπης και της φιλίας απέναντι στο κρύο και τη μοναξιά.`,
    shortDescription:
      'Η Κακιά Βασίλισσα κλέβει τα Χριστούγεννα — νεράιδες και ξωτικά ενώνονται για να τα σώσουν.',
    categories: ['Εορταστικό', 'Περιπέτεια', 'Φαντασία'],
    season: 'Χριστούγεννα',
    grades: ['Δημοτικό', 'Γυμνάσιο'],
    ageGroups: ['Παιδική (6–9)', 'Προεφηβική (10–12)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/pagomena-xristougenna-1/thumbnail.jpg',
    heroImage: '/plays/pagomena-xristougenna-1/thumbnail.jpg',
    duration: '55 λεπ.',
    ageGroup: '5–12',
    characters: 14,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/pagomena-xristougenna-1/play.pdf',
  },
  {
    id: 'pagomena-xristougenna-2',
    title: 'Τα Παγωμένα Χριστούγεννα — Έκδοχη Β\'',
    description: `Η ίδια συναρπαστική ιστορία της Κακιάς Βασίλισσας που κλέβει τα Χριστούγεννα, σε εναλλακτική έκδοχη για θιάσους ξωτικών. Ο Άγιος Βασίλης και το εργαστήριό του απειλούνται — μόνο η ενότητα και το θάρρος των μικρών ηρώων μπορούν να σώσουν τη γιορτή.

Η Β' Έκδοχη αντικαθιστά τις νεράιδες με ξωτικά, δίνοντας περισσότερους ρόλους σε αγόρια και επιτρέποντας ευέλικτη διανομή για σχολεία και παιδικές θεατρικές ομάδες. Δύο εκδοχές, μία παράσταση — διαλέξτε αυτή που ταιριάζει στην ομάδα σας!`,
    shortDescription:
      'Εναλλακτική έκδοχη με ξωτικά αντί νεράιδων — για θιάσους που χρειάζονται ευέλικτη διανομή ρόλων.',
    categories: ['Εορταστικό', 'Περιπέτεια', 'Φαντασία'],
    season: 'Χριστούγεννα',
    grades: ['Δημοτικό', 'Γυμνάσιο'],
    ageGroups: ['Παιδική (6–9)', 'Προεφηβική (10–12)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/pagomena-xristougenna-2/thumbnail.jpg',
    heroImage: '/plays/pagomena-xristougenna-2/thumbnail.jpg',
    duration: '55 λεπ.',
    ageGroup: '5–12',
    characters: 14,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/pagomena-xristougenna-2/play.pdf',
  },
  {
    id: 'karagkiozis-treis-magoi',
    title: 'Ο Καραγκιόζης και οι Τρεις Μάγοι',
    description: `Παραμονές της Γέννησης του Χριστού, ο φτωχός αλλά πανέξυπνος Καραγκιόζης μαθαίνει πως οι Τρεις Μάγοι της Ανατολής περνούν από την περιοχή ακολουθώντας το φωτεινό αστέρι προς τη Βηθλεέμ. Ελπίζοντας να εξασφαλίσει λίγο φαγητό για την πεινασμένη οικογένειά του, ξεκινά να τους αναζητήσει — την ίδια ώρα που ο πανούργος Πασάς σχεδιάζει να αρπάξει τον χρυσό, το λιβάνι και τη σμύρνα που προορίζονται για τον νεογέννητο Χριστό.

Μια χριστουγεννιάτικη κωμωδία εμπνευσμένη από το ελληνικό Θέατρο Σκιών, γεμάτη κωμικές παρεξηγήσεις, ανατροπές και λαϊκό χιούμορ. Χωρίς βία, μόνο με εξυπνάδα και πονηριά, ο Καραγκιόζης θυμίζει πως ο πραγματικά σπουδαίος άνθρωπος είναι εκείνος που επιλέγει το σωστό. Μπορεί να ανέβει είτε ως παράσταση Θεάτρου Σκιών είτε με ηθοποιούς.`,
    shortDescription:
      'Χριστουγεννιάτικη κωμωδία με τον Καραγκιόζη να βοηθά τους Τρεις Μάγους να φτάσουν στη Βηθλεέμ.',
    categories: ['Εορταστικό', 'Κωμωδία', 'Θέατρο Σκιών'],
    season: 'Χριστούγεννα',
    grades: ['Δημοτικό'],
    ageGroups: ['Παιδική (6–9)', 'Προεφηβική (10–12)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/karagkiozis-treis-magoi/thumbnail.jpg',
    heroImage: '/plays/karagkiozis-treis-magoi/thumbnail.jpg',
    duration: '30–35 λεπ.',
    ageGroup: '8–12',
    characters: 15,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/karagkiozis-treis-magoi/play.pdf',
  },
  {
    id: 'ta-xexasmena-stolidia',
    title: 'Τα Ξεχασμένα Στολίδια των Χριστουγέννων',
    description: `Μια οικογένεια ετοιμάζεται να στολίσει το χριστουγεννιάτικο δέντρο με τα παλιά της στολίδια. Μόλις όμως αποχωρήσουν, τα στολίδια ζωντανεύουν: μπάλες, γιρλάντες, καμπανούλες, νιφάδες, αγγελάκια και αστέρια αφηγούνται τις δικές τους ιστορίες, θυμούνται όμορφες στιγμές και εκφράζουν τον φόβο τους μήπως ξεχαστούν.

Γραμμένο σε έμμετρο λόγο με ομοιοκαταληξία και δομημένο σε δώδεκα αυτοτελείς σκηνές, το έργο υπενθυμίζει πως η πραγματική αξία δεν βρίσκεται στο καινούργιο ή στο ακριβό, αλλά στις αναμνήσεις, στην παράδοση και στην αγάπη. Ο αριθμός των συμμετεχόντων είναι ευέλικτος (από ~20 έως 35+ παιδιά), ιδανικό για σχολικές γιορτές.`,
    shortDescription:
      'Τα παλιά στολίδια του δέντρου ζωντανεύουν και θυμούνται — ένα έμμετρο έργο για την αξία των αναμνήσεων.',
    categories: ['Εορταστικό', 'Οικογενειακό', 'Έμμετρο'],
    season: 'Χριστούγεννα',
    grades: ['Νηπιαγωγείο', 'Δημοτικό'],
    ageGroups: ['Προσχολική (3–5)', 'Παιδική (6–9)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/ta-xexasmena-stolidia/thumbnail.jpg',
    heroImage: '/plays/ta-xexasmena-stolidia/thumbnail.jpg',
    duration: '35–45 λεπ.',
    ageGroup: '4–10',
    characters: 20,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/ta-xexasmena-stolidia/play.pdf',
  },
  {
    id: 'protoxronia-paixnidoxora',
    title: 'Πρωτοχρονιά στην Παιχνιδοχώρα',
    description: `Παραμονές Χριστουγέννων του 1951, η Κυρά Σμαράγδω, μια Μικρασιάτισσα πρόσφυγας που έχει αφιερώσει τη ζωή της στην κατασκευή παιχνιδιών, θυμάται το θαύμα που άλλαξε για πάντα τη ζωή της. Στον φάρο όπου λειτουργεί το παιχνιδοποιείο της παίζουν καθημερινά παιδιά — ώσπου ο πειρασμός τα οδηγεί να πάρουν κρυφά μερικά παιχνίδια, μια πράξη που θα τα φέρει αντιμέτωπα με τις επιλογές τους.

Μέσα από μικρασιατικά χριστουγεννιάτικα έθιμα, μνήμες προσφυγιάς και ένα αναπάντεχο θαύμα, το έργο αναδεικνύει τη δύναμη της ειλικρίνειας, της συγχώρεσης και της προσφοράς. Απευθύνεται κυρίως σε μαθητές Γυμνασίου και συνδυάζει τη συγκίνηση με τη βιωματική μάθηση της νεότερης ελληνικής ιστορίας.`,
    shortDescription:
      'Στον φάρο μιας Μικρασιάτισσας παιχνιδοποιού, ένα χριστουγεννιάτικο θαύμα διδάσκει ειλικρίνεια και συγχώρεση.',
    categories: ['Εορταστικό', 'Ιστορικό', 'Δράμα'],
    season: 'Χριστούγεννα',
    grades: ['Γυμνάσιο'],
    ageGroups: ['Έφηβοι (12+)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Έφηβοι'],
    image: '/plays/protoxronia-paixnidoxora/thumbnail.jpg',
    heroImage: '/plays/protoxronia-paixnidoxora/thumbnail.jpg',
    duration: '25–30 λεπ.',
    ageGroup: '12–15',
    characters: 12,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/protoxronia-paixnidoxora/play.pdf',
  },
  {
    id: 'black-out-paixnidoxora',
    title: 'Black out στην Παιχνιδοχώρα',
    description: `Η Ρα και ο Χα, δύο ζωντανά παιχνίδια, μας καλούν να επιβιβαστούμε στο τρένο τους για την Παιχνιδοχώρα — έναν μαγικό τόπο όπου τα παλιά παιχνίδια δεν χάνονται, αλλά συνεχίζουν να ζουν και να διηγούνται τις ιστορίες τους. Στην καρδιά του κόσμου αυτού βρίσκεται η Κυρία Σμαράγδα, η «βασίλισσα» των παιχνιδιών.

Η αρμονία όμως διαταράσσεται όταν μια ξεχασμένη φιγούρα του Θεάτρου Σκιών, η Μπόρα, σβήνει το φως της Παιχνιδοχώρας για να τραβήξει την προσοχή. Μια μουσικοθεατρική παράσταση γεμάτη τραγούδι, χιούμορ και συναίσθημα, όπου τα αντικείμενα έχουν ψυχή και οι αναμνήσεις αποκτούν φωνή — για παιδιά και ενήλικες.`,
    shortDescription:
      'Δύο ζωντανά παιχνίδια μάς ταξιδεύουν στην Παιχνιδοχώρα, όπου η φαντασία συναντά τη μνήμη.',
    categories: ['Μιούζικαλ', 'Φαντασία'],
    season: '',
    grades: ['Δημοτικό'],
    ageGroups: ['Παιδική (6–9)', 'Προεφηβική (10–12)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/black-out-paixnidoxora/cover.jpg',
    heroImage: '/plays/black-out-paixnidoxora/cover.jpg',
    duration: '60–70 λεπ.',
    ageGroup: '6–12',
    characters: 9,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/black-out-paixnidoxora/play.pdf',
  },
  {
    id: 'belades-iliako-systima',
    title: 'Μπελάδες στο Ηλιακό Σύστημα',
    description: `Ο Σελήνιος και η Σέλαινα καταστρώνουν κρυφά το σχέδιο «Σεληνουά», με στόχο να αλλάξουν τη μοίρα της Σελήνης και να αποκτήσουν περισσότερο φως από όσο τους αναλογεί. Για να το πετύχουν, διαδίδουν ψευδείς ειδήσεις πως οι άνθρωποι της Γης ετοιμάζουν εισβολή — και το Ηλιακό Σύστημα αναστατώνεται.

Όταν ο ΗΛΙΟΣ καλείται να δώσει λύση, αποκαλύπτεται πως η απειλή δεν ήταν αυτή που όλοι πίστευαν. Μια διαστημική κωμωδία με επιστημονικά στοιχεία, σατιρικές πινελιές και οικολογικό μήνυμα, που φωτίζει τη σημασία της υπευθυνότητας, της συνεργασίας και της σωστής ενημέρωσης. Γραμμένο για Γ'–ΣΤ' Δημοτικού, με ρόλο για κάθε παιδί.`,
    shortDescription:
      'Μια διαστημική κωμωδία για την παραπληροφόρηση, τη συνεργασία και την ευθύνη — με ρόλο για κάθε παιδί.',
    categories: ['Κωμωδία', 'Επιστημονική Φαντασία', 'Εκπαιδευτικό'],
    season: '',
    grades: ['Δημοτικό'],
    ageGroups: ['Παιδική (6–9)', 'Προεφηβική (10–12)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/belades-iliako-systima/thumbnail.jpg',
    heroImage: '/plays/belades-iliako-systima/thumbnail.jpg',
    duration: '60 λεπ.',
    ageGroup: '8–12',
    characters: 17,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/belades-iliako-systima/play.pdf',
  },
  {
    id: 'to-koxylosentoukaki',
    title: 'Το Κοχυλοσεντουκάκι',
    description: `Μια σχολική τάξη φτάνει με τον δάσκαλό της σε μια παραλία γεμάτη κοχύλια. Εκεί μαθαίνουν πως τα κοχύλια «μιλούν τη γλώσσα του βυθού»: αν τα βάλεις στο αυτί σου, όσα χρόνια κι αν περάσουν, θα ακούς τον παφλασμό των κυμάτων.

Ένα τρυφερό, καλοκαιρινό έργο για το τέλος της σχολικής χρονιάς, γραμμένο για την ΣΤ' Δημοτικού, που μιλά για τη μνήμη, τους δεσμούς μιας τάξης και τις αναμνήσεις που κουβαλάμε μαζί μας.`,
    shortDescription:
      'Σε μια παραλία γεμάτη κοχύλια, μια τάξη ανακαλύπτει πως οι αναμνήσεις δεν σβήνουν ποτέ.',
    categories: ['Εκπαιδευτικό', 'Αποχαιρετισμός'],
    season: 'Καλοκαίρι',
    grades: ['Δημοτικό'],
    ageGroups: ['Προεφηβική (10–12)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/to-koxylosentoukaki/thumbnail.jpg',
    heroImage: '/plays/to-koxylosentoukaki/thumbnail.jpg',
    duration: '20 λεπ.',
    ageGroup: '10–12',
    characters: 12,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/to-koxylosentoukaki/play.pdf',
  },
  {
    id: 'i-profiteia',
    title: 'Η Προφητεία',
    description: `Ένα θεατρικό αφιερωμένο στην 28η Οκτωβρίου. Μέσα από τη ζωή μιας οικογένειας και μιας ολόκληρης γειτονιάς, ξετυλίγεται η ιστορία των δύσκολων χρόνων — του πολέμου, της κατοχής και της αντίστασης του ελληνικού λαού.

Με φόντο ένα σπίτι που περνά από γενιά σε γενιά, το έργο πλέκει τη μνήμη με το σήμερα και υπενθυμίζει την αξία της ελευθερίας, της θυσίας και της συλλογικής μνήμης. Ιδανικό για σχολική γιορτή της Εθνικής Επετείου.`,
    shortDescription:
      'Ένα θεατρικό για την 28η Οκτωβρίου: η ιστορία μιας οικογένειας και της αντίστασης, μέσα από τη μνήμη.',
    categories: ['Εθνική Γιορτή', 'Ιστορικό', 'Δράμα'],
    season: '28η Οκτωβρίου',
    grades: ['Δημοτικό', 'Γυμνάσιο'],
    ageGroups: ['Προεφηβική (10–12)', 'Έφηβοι (12+)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/i-profiteia/thumbnail.jpg',
    heroImage: '/plays/i-profiteia/thumbnail.jpg',
    duration: '45 λεπ.',
    ageGroup: '9–15',
    characters: 16,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/i-profiteia/play.pdf',
  },
  {
    id: 'mia-nyxta-sto-palermo',
    title: 'Μια Νύχτα στο Παλέρμο — Το Τελευταίο Παιχνίδι',
    description: `Μια παρέα νέων συναντιέται σε ένα εγκαταλελειμμένο αρχοντικό για να γιορτάσει τα γενέθλια της Κατερίνας. Αντί για ποτό, αποφασίζουν να παίξουν το γνωστό παιχνίδι «Μια Νύχτα στο Παλέρμο», όπου κάποιοι είναι «κακοί» και οι υπόλοιποι «καλοί». Σιγά σιγά όμως το παιχνίδι ξεφεύγει: μυστικά βγαίνουν στην επιφάνεια, παλιές ενοχές και ζήλιες δυναμιτίζουν την παρέα, και οι «φόνοι» του παιχνιδιού γίνονται πραγματικοί.

Μια μαύρη κωμωδία με αγωνία και ανατροπές, για εφήβους και νεανικές/ερασιτεχνικές ομάδες (άνω των 12 ετών). Πίσω από το παιχνίδι κρύβονται αλήθειες που θα σημαδέψουν τους ήρωες για πάντα.`,
    shortDescription:
      'Ένα αθώο παιχνίδι σε ένα ερημικό αρχοντικό μετατρέπεται σε εφιάλτη — μαύρη κωμωδία για εφήβους.',
    categories: ['Μαύρη Κωμωδία', 'Μυστήριο', 'Θρίλερ'],
    season: '',
    grades: ['Γυμνάσιο', 'Λύκειο'],
    ageGroups: ['Έφηβοι (12+)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Έφηβοι'],
    image: '/plays/mia-nyxta-sto-palermo/cover.jpg',
    heroImage: '/plays/mia-nyxta-sto-palermo/cover.jpg',
    duration: '1 ώρα & 40 λεπ.',
    ageGroup: '12+',
    characters: 9,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/mia-nyxta-sto-palermo/play.pdf',
  },
  {
    id: 'i-konti-kaminada',
    title: 'Η Κοντή Καμινάδα',
    description: `Οι καμινάδες ενός μικρού χωριού καμαρώνουν για το ύψος τους και κοροϊδεύουν μια καινούργια, κοντή καμινάδα που δείχνει να μην έχει θέση ανάμεσά τους. Η ίδια αρχίζει να αμφιβάλλει για την αξία της — ακόμη κι ο Τζακάς που τη σχεδίασε πιστεύει πως έκανε λάθος.

Όταν όμως οι καπνοί γεμίζουν τον ουρανό και ο Άγιος Βασίλης δυσκολεύεται να βρει τα σπίτια των παιδιών, η μικρή καμινάδα αποδεικνύεται η πιο κατάλληλη για να φέρει το χριστουγεννιάτικο θαύμα. Ένα έμμετρο έργο με ομοιοκαταληξία, χιούμορ και τραγούδι, που μιλά στα παιδιά για τη διαφορετικότητα, την αυτοεκτίμηση, την αποδοχή και την αξία που κρύβει ο καθένας μέσα του.`,
    shortDescription:
      'Μια κοντή καμινάδα που όλοι κορόιδευαν αποδεικνύεται η μόνη που μπορεί να φέρει το χριστουγεννιάτικο θαύμα.',
    categories: ['Εορταστικό', 'Μιούζικαλ', 'Έμμετρο'],
    season: 'Χριστούγεννα',
    grades: ['Δημοτικό'],
    ageGroups: ['Προσχολική (3–5)', 'Παιδική (6–9)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Παιδιά'],
    image: '/plays/i-konti-kaminada/thumbnail.jpg',
    heroImage: '/plays/i-konti-kaminada/thumbnail.jpg',
    duration: '30–35 λεπ.',
    ageGroup: '5–8',
    characters: 15,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/i-konti-kaminada/play.pdf',
  },
  {
    id: 'girasko-aei-didaskomenos',
    title: 'Γηράσκω αεί διδασκόμενος',
    description: `Ένας δάσκαλος επιστρέφει έπειτα από χρόνια στο χωριό του, όπου ο δήμαρχος τον έχει βάλει να παραδίδει απογευματινά «μαθήματα για ενήλικες». Μέσα σε ένα ξεκαρδιστικό σκηνικό — από το τοπικό ραδιόφωνο μέχρι μια «τάξη» στην εξοχή — μια παρέα χωρικών αποφασίζει πως ποτέ δεν είναι αργά για να μάθει κανείς.

Μια κωμωδία για εφήβους και ερασιτεχνικές ομάδες, γεμάτη χιούμορ, ζωντανούς χαρακτήρες και τοπικό χρώμα, που γιορτάζει την αξία της γνώσης και της δια βίου μάθησης — γιατί, όπως λέει και ο τίτλος, «γηράσκω αεί διδασκόμενος».`,
    shortDescription:
      'Ένας δάσκαλος διδάσκει «μαθήματα ενηλίκων» σε ένα χωριό — μια κωμωδία για τη δια βίου μάθηση.',
    categories: ['Κωμωδία', 'Εκπαιδευτικό'],
    season: '',
    grades: ['Γυμνάσιο', 'Λύκειο'],
    ageGroups: ['Έφηβοι (12+)'],
    audiences: ['Ερασιτεχνικές ομάδες', 'Έφηβοι'],
    image: '/plays/girasko-aei-didaskomenos/cover.jpg',
    heroImage: '/plays/girasko-aei-didaskomenos/cover.jpg',
    duration: '60 λεπ.',
    ageGroup: '12+',
    characters: 9,
    author: 'Παναγιώτης Χρυσίδης',
    pdfUrl: '/plays/girasko-aei-didaskomenos/play.pdf',
  },
];

/** Πεζοποίηση + αφαίρεση τόνων, ώστε η αναζήτηση να αγνοεί τόνους/κεφαλαία. */
function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Ελαφρύ αντικείμενο για αναζήτηση/αποτελέσματα (περνά και στον client). */
export type PlaySearchItem = Pick<
  Play,
  | 'id'
  | 'title'
  | 'image'
  | 'shortDescription'
  | 'author'
  | 'categories'
  | 'season'
  | 'grades'
  | 'ageGroups'
  | 'audiences'
>;

/**
 * Αναζήτηση έργων: επιστρέφει όσα ταιριάζουν σε ΟΛΟΥΣ τους όρους (AND),
 * αγνοώντας τόνους και κεφαλαία. Δουλεύει και με πλήρη Play και με το ελαφρύ index.
 */
export function searchPlays<T extends PlaySearchItem>(
  plays: T[],
  query: string
): T[] {
  const q = normalizeText(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return plays.filter((p) => {
    const hay = normalizeText(
      [
        p.title,
        p.author,
        p.shortDescription,
        p.season,
        ...(p.categories ?? []),
        ...(p.grades ?? []),
        ...(p.ageGroups ?? []),
        ...(p.audiences ?? []),
      ]
        .filter(Boolean)
        .join(' ')
    );
    return terms.every((t) => hay.includes(t));
  });
}

export function getPlayById(plays: Play[], id: string): Play | undefined {
  return plays.find((p) => p.id === id);
}

export function getRelatedPlays(plays: Play[], play: Play, count = 3): Play[] {
  return plays
    .filter(
      (p) => p.id !== play.id && p.categories.some((c) => play.categories.includes(c))
    )
    .slice(0, count);
}

export function getAllCategories(plays: Play[]): string[] {
  const all = plays.flatMap((p) => p.categories);
  return [...new Set(all)].sort();
}

/** Οι διαθέσιμες τιμές μιας διάστασης, με βάση τα δοσμένα έργα. */
export function getValuesForDimension(
  plays: Play[],
  dim: TaxonomyDimension
): string[] {
  const values = plays.flatMap((p) => {
    const v = p[dim.field];
    return Array.isArray(v) ? v : [v];
  });
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, 'el'));
}

/** Ενεργά φίλτρα ανά search param. */
export type PlayFilters = Partial<Record<TaxonomyDimension['param'], string>>;

/** Επιστρέφει το πεδίο του Play που αντιστοιχεί σε ένα search param. */
function fieldForParam(
  param: TaxonomyDimension['param']
): TaxonomyDimension['field'] | undefined {
  return taxonomy.find((d) => d.param === param)?.field;
}

/** Φιλτράρει τα έργα με βάση όλα τα ενεργά φίλτρα (λογικό AND). */
export function filterPlays(plays: Play[], filters: PlayFilters): Play[] {
  const active = Object.entries(filters).filter(([, val]) => Boolean(val)) as [
    TaxonomyDimension['param'],
    string,
  ][];

  if (active.length === 0) return plays;

  return plays.filter((p) =>
    active.every(([param, value]) => {
      const field = fieldForParam(param);
      if (!field) return true;
      const fieldValue = p[field];
      return Array.isArray(fieldValue)
        ? fieldValue.includes(value)
        : fieldValue === value;
    })
  );
}
