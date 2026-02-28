// languageKeywords.js
// All keywords are lowercase for case-insensitive matching
// Loaded as a content script before content.js

const LANGUAGE_DATA = {
    en: {
        name: "English",
        required: [
            "english required", "english mandatory", "english essential", "english necessary",
            "fluent english", "native english", "proficient english", "english proficiency",
            "business english", "professional english", "excellent english", "strong english",
            "advanced english", "english speaking", "english language", "must speak english",
            "english indispensable", "english compulsory", "english obligatory", "native-level english",
            "mother tongue english", "first language english", "english c2", "english c1", "english b2",
            "cefr english", "ielts english", "toefl english", "full professional english",
            "english is required", "english is mandatory", "english is essential", "english is necessary",
            "requires english", "needs english", "english needed", "english must",
            "written english", "spoken english", "verbal english", "conversational english"
        ],
        fluent: [
            "good english", "intermediate english", "working english", "basic english",
            "english preferred", "english nice to have", "english advantage", "english plus",
            "english b1", "english a2", "school english", "basic knowledge of english"
        ],
        optional: [
            "english nice to have", "english preferred", "english advantage", "english plus",
            "basic english", "elementary english"
        ]
    },
    de: {
        name: "German",
        required: [
            "deutsch erforderlich", "deutsch notwendig", "deutsch zwingend", "deutsch verpflichtend",
            "deutsch obligatorisch", "deutsch unabdingbar", "deutsch essenziell", "deutsch vorausgesetzt",
            "deutschkenntnisse erforderlich", "deutschkenntnisse notwendig", "deutschkenntnisse zwingend",
            "fließend deutsch", "verhandlungssicher deutsch", "sehr gute deutschkenntnisse",
            "ausgezeichnete deutschkenntnisse", "perfekte deutschkenntnisse", "muttersprachler deutsch",
            "muttersprache deutsch", "deutsch als muttersprache", "deutsch c2", "deutsch c1",
            "goethe-zertifikat", "testdaf", "telc deutsch", "deutsche sprache", "deutsch in wort und schrift",
            "sichere deutschkenntnisse", "fundierte deutschkenntnisse", "solide deutschkenntnisse",
            "verhandlungssichere deutschkenntnisse", "fließende deutschkenntnisse", "deutsch fließend",
            "deutsch verhandlungssicher", "german required", "german mandatory", "fluent german",
            "native german", "business german", "professional german", "german c2", "german c1",
            "german is required", "german is mandatory", "requires german", "needs german", "german needed"
        ],
        fluent: [
            "gute deutschkenntnisse", "grundlegende deutschkenntnisse", "deutschkenntnisse wünschenswert",
            "deutsch b2", "deutsch b1", "deutsch anwenderkenntnisse", "deutsch fortgeschritten",
            "gute mündliche deutschkenntnisse", "gute schriftliche deutschkenntnisse", "deutschkenntnisse mindestens",
            "good german", "intermediate german", "basic german", "german preferred", "german nice to have",
            "german advantage", "german plus", "german b1", "german b2", "basic knowledge of german"
        ],
        optional: [
            "deutschkenntnisse von vorteil", "deutschkenntnisse wünschenswert", "deutsch von vorteil",
            "grundkenntnisse deutsch", "deutschkenntnisse hilfreich", "german nice to have", "german preferred",
            "german advantage", "german plus", "basic german"
        ]
    },
    fr: {
        name: "French",
        required: [
            "français requis", "français obligatoire", "français nécessaire", "français exigé",
            "français indispensable", "français essentiel", "français impératif", "maîtrise du français",
            "parler français", "français courant", "excellente maîtrise du français", "parfaite maîtrise du français",
            "français natif", "langue maternelle française", "français langue maternelle", "locuteur natif français",
            "français c2", "français c1", "delf", "dalf", "tcf", "très bon français", "français parfait",
            "français professionnel", "français des affaires", "français courant à l'oral", "français courant à l'écrit",
            "compétences en français", "maîtriser le français", "parler couramment français", "communiquer en français",
            "french required", "french mandatory", "fluent french", "native french", "business french",
            "french c2", "french c1", "french is required", "french is mandatory", "requires french", "needs french"
        ],
        fluent: [
            "bonne maîtrise du français", "solide maîtrise du français", "français avancé", "français intermédiaire",
            "français b2", "français b1", "bon français", "français oral", "français écrit", "niveau de français",
            "bonne connaissance du français", "excellente connaissance du français", "good french", "intermediate french",
            "basic french", "french preferred", "french nice to have", "french advantage", "french b1", "french b2"
        ],
        optional: [
            "français souhaité", "français désiré", "français un plus", "français avantageux", "notions de français",
            "français débutant", "french nice to have", "french preferred", "french advantage", "basic french"
        ]
    },
    es: {
        name: "Spanish",
        required: [
            "español requerido", "español obligatorio", "español necesario", "español exigido",
            "español indispensable", "español esencial", "español imperativo", "dominio del español",
            "hablar español", "español fluido", "excelente dominio del español", "perfecto dominio del español",
            "español nativo", "lengua materna española", "español lengua materna", "hablante nativo español",
            "español c2", "español c1", "dele", "siele", "muy buen español", "español perfecto",
            "español profesional", "español de negocios", "español fluido oral", "español fluido escrito",
            "dominar el español", "hablar con fluidez español", "comunicarse en español", "redactar en español",
            "spanish required", "spanish mandatory", "fluent spanish", "native spanish", "business spanish",
            "spanish c2", "spanish c1", "spanish is required", "spanish is mandatory", "requires spanish", "needs spanish"
        ],
        fluent: [
            "buen dominio del español", "sólido dominio del español", "español avanzado", "español intermedio",
            "español b2", "español b1", "buen español", "español oral", "español escrito", "nivel de español",
            "buen conocimiento del español", "excelente conocimiento del español", "good spanish", "intermediate spanish",
            "basic spanish", "spanish preferred", "spanish nice to have", "spanish advantage", "spanish b1", "spanish b2"
        ],
        optional: [
            "español deseable", "español valorable", "español un plus", "español ventajoso", "nociones de español",
            "español básico", "spanish nice to have", "spanish preferred", "spanish advantage", "basic spanish"
        ]
    },
    nl: {
        name: "Dutch",
        required: [
            "nederlands vereist", "nederlands verplicht", "nederlands noodzakelijk", "nederlands gevraagd",
            "nederlands onmisbaar", "nederlands essentieel", "nederlands imperatief", "beheersing van het nederlands",
            "nederlands spreken", "vloeiend nederlands", "uitstekend nederlands", "perfect nederlands",
            "nederlands moedertaal", "moedertaal nederlands", "nederlandstalig", "nederlandse taal",
            "nederlands c2", "nederlands c1", "nt2", "staatsexamen nederlands", "zeer goed nederlands",
            "nederlands professioneel", "nederlands zakelijk", "nederlands mondeling", "nederlands schriftelijk",
            "nederlands beheersen", "vloeiend nederlands spreken", "communiceren in het nederlands",
            "dutch required", "dutch mandatory", "fluent dutch", "native dutch", "business dutch",
            "dutch c2", "dutch c1", "dutch is required", "dutch is mandatory", "requires dutch", "needs dutch"
        ],
        fluent: [
            "goed nederlands", "sterk nederlands", "nederlands gevorderd", "nederlands gemiddeld",
            "nederlands b2", "nederlands b1", "nederlands niveau", "goede kennis van nederlands",
            "uitstekende kennis van nederlands", "good dutch", "intermediate dutch", "basic dutch",
            "dutch preferred", "dutch nice to have", "dutch advantage", "dutch b1", "dutch b2"
        ],
        optional: [
            "nederlands gewenst", "nederlands mooi meegenomen", "nederlands een pre", "nederlands voordeel",
            "nederlands basis", "dutch nice to have", "dutch preferred", "dutch advantage", "basic dutch"
        ]
    },
    it: {
        name: "Italian",
        required: [
            "italiano richiesto", "italiano obbligatorio", "italiano necessario", "italiano indispensabile",
            "italiano essenziale", "italiano imperativo", "conoscenza dell'italiano", "padronanza dell'italiano",
            "parlare italiano", "italiano fluente", "eccellente conoscenza dell'italiano", "perfetta conoscenza dell'italiano",
            "italiano madrelingua", "lingua madre italiana", "italiano come lingua madre", "madrelingua italiano",
            "italiano c2", "italiano c1", "cils", "celi", "plida", "italiano ottimo", "italiano perfetto",
            "italiano professionale", "italiano commerciale", "italiano orale", "italiano scritto",
            "padroneggiare l'italiano", "parlare fluentemente italiano", "comunicare in italiano",
            "italian required", "italian mandatory", "fluent italian", "native italian", "business italian",
            "italian c2", "italian c1", "italian is required", "italian is mandatory", "requires italian", "needs italian"
        ],
        fluent: [
            "buona conoscenza dell'italiano", "solida conoscenza dell'italiano", "italiano avanzato", "italiano intermedio",
            "italiano b2", "italiano b1", "italiano buono", "italiano livello", "ottima conoscenza dell'italiano",
            "good italian", "intermediate italian", "basic italian", "italian preferred", "italian nice to have",
            "italian advantage", "italian b1", "italian b2"
        ],
        optional: [
            "italiano desiderato", "italiano gradito", "italiano un plus", "italiano vantaggioso", "nozioni di italiano",
            "italiano base", "italian nice to have", "italian preferred", "italian advantage", "basic italian"
        ]
    },
    no: {
        name: "Norwegian",
        required: [
            "norsk kreves", "norsk påkrevd", "norsk nødvendig", "norsk obligatorisk", "norsk uunnværlig",
            "norsk essensielt", "norsk imperativ", "norskkunnskaper kreves", "flytende norsk", "utmerket norsk",
            "perfekt norsk", "norsk morsmål", "morsmål norsk", "norsktalende", "norsk språk", "norsk c2", "norsk c1",
            "norskprøven", "norsk test", "norsk på høyt nivå", "norsk på avansert nivå", "norsk perfekt",
            "norsk profesjonelt", "norsk muntlig", "norsk skriftlig", "beherske norsk", "snakke flytende norsk",
            "kommunisere på norsk", "norsk både muntlig og skriftlig",
            "norwegian required", "norwegian mandatory", "fluent norwegian", "native norwegian", "business norwegian",
            "norwegian c2", "norwegian c1", "norwegian is required", "norwegian is mandatory", "requires norwegian", "needs norwegian"
        ],
        fluent: [
            "godt norsk", "sterk norsk", "norsk på middels nivå", "norsk på grunnleggende nivå", "norsk b2", "norsk b1",
            "norsk nivå", "gode norskkunnskaper", "utmerkede norskkunnskaper", "good norwegian", "intermediate norwegian",
            "basic norwegian", "norwegian preferred", "norwegian nice to have", "norwegian advantage", "norwegian b1", "norwegian b2"
        ],
        optional: [
            "norsk ønsket", "norsk en fordel", "norsk et pluss", "norsk fordel", "norsk grunnleggende",
            "norwegian nice to have", "norwegian preferred", "norwegian advantage", "basic norwegian"
        ]
    },
    fi: {
        name: "Finnish",
        required: [
            "suomi vaaditaan", "suomi pakollinen", "suomi välttämätön", "suomi tarpeellinen", "suomi edellytetään",
            "suomi olennaista", "suomen kieli vaaditaan", "suomen kielen taito vaaditaan", "sujuva suomi",
            "erinomainen suomi", "täydellinen suomi", "suomi äidinkieli", "äidinkieli suomi", "suomenkielinen",
            "suomen kieli", "suomi c2", "suomi c1", "yki", "yki-tutkinto", "erittäin hyvä suomi", "suomi täydellinen",
            "suomi ammatillinen", "suomi suullinen", "suomi kirjallinen", "hallita suomea", "puhua sujuvaa suomea",
            "kommunikoida suomella", "suomi sekä suullisesti että kirjallisesti",
            "finnish required", "finnish mandatory", "fluent finnish", "native finnish", "business finnish",
            "finnish c2", "finnish c1", "finnish is required", "finnish is mandatory", "requires finnish", "needs finnish"
        ],
        fluent: [
            "hyvä suomi", "vahva suomi", "suomi edistynyt", "suomi keskitaso", "suomi b2", "suomi b1",
            "suomen taso", "hyvät suomen kielen taidot", "erinomaiset suomen kielen taidot", "good finnish",
            "intermediate finnish", "basic finnish", "finnish preferred", "finnish nice to have", "finnish advantage", "finnish b1", "finnish b2"
        ],
        optional: [
            "suomi toivottu", "suomi eduksi", "suomi plussa", "suomi etu", "suomi alkeet",
            "finnish nice to have", "finnish preferred", "finnish advantage", "basic finnish"
        ]
    }
};

// Global Exclusion List — prevents false positives (e.g. "no German required")
const LANGUAGE_EXCLUSIONS = [
    "no german required", "german not required", "without german", "german unnecessary",
    "no english required", "english not required", "without english", "english unnecessary",
    "no french required", "french not required", "without french", "french unnecessary",
    "no spanish required", "spanish not required", "without spanish", "spanish unnecessary",
    "no dutch required", "dutch not required", "without dutch", "dutch unnecessary",
    "no italian required", "italian not required", "without italian", "italian unnecessary",
    "no norwegian required", "norwegian not required", "without norwegian", "norwegian unnecessary",
    "no finnish required", "finnish not required", "without finnish", "finnish unnecessary",
    "non-german", "non-english", "non-french", "non-spanish", "non-dutch",
    "non-italian", "non-norwegian", "non-finnish",
    "english speaking country", "german speaking country", "french speaking country",
    "spanish speaking country", "dutch speaking country", "italian speaking country",
    "norwegian speaking country", "finnish speaking country"
];

/**
 * Check whether a job description text requires a specific language.
 * @param {string} text - Full job description text
 * @param {string} langCode - One of: de, fr, es, nl, it, no, fi
 * @returns {{ status: 'required'|'fluent'|'optional'|'none', confidence: number, reason: string }}
 */
function checkLanguageRequirement(text, langCode) {
    if (!LANGUAGE_DATA[langCode]) return { status: 'none', confidence: 0, reason: 'unknown lang' };

    const lower = text.toLowerCase();

    // 1. Exclusions — if text says "no X required" etc., bail out immediately
    for (const exclusion of LANGUAGE_EXCLUSIONS) {
        if (lower.includes(exclusion)) {
            return { status: 'none', confidence: 1, reason: exclusion };
        }
    }

    // 2. Required — highest priority
    for (const keyword of LANGUAGE_DATA[langCode].required) {
        if (lower.includes(keyword)) {
            return { status: 'required', confidence: 1, reason: keyword };
        }
    }

    // 3. Fluent / intermediate (still a real requirement, just not top-level)
    for (const keyword of LANGUAGE_DATA[langCode].fluent) {
        if (lower.includes(keyword)) {
            return { status: 'fluent', confidence: 0.8, reason: keyword };
        }
    }

    // 4. Optional / preferred
    for (const keyword of LANGUAGE_DATA[langCode].optional) {
        if (lower.includes(keyword)) {
            return { status: 'optional', confidence: 0.5, reason: keyword };
        }
    }

    return { status: 'none', confidence: 0, reason: '' };
}

// ─── Proximity-based Detection ────────────────────────────────────────────────
// Catches patterns like "fluent in English and German" or
// "sehr gute Sprachkompetenz in Deutsch" where the language name and the
// signal word are nearby but not in an exact phrase from the keyword list.

// Language name variants (single words / short tokens) to search for
const LANGUAGE_NAME_VARIANTS = {
    de: ['german', 'deutsch', 'deutschsprachig', 'deutschkenntnisse'],
    fr: ['french', 'français', 'francophone', 'französisch'],
    es: ['spanish', 'español', 'castellano'],
    nl: ['dutch', 'nederlands', 'nederlandstalig'],
    it: ['italian', 'italiano'],
    no: ['norwegian', 'norsk'],
    fi: ['finnish', 'suomi'],
};

// Signal words that — when found within ~120 chars of a language name — indicate
// the language is required/expected. Covers English and native-language variants.
const PROXIMITY_REQUIRED_SIGNALS = [
    // English
    'fluent', 'native', 'proficient', 'proficiency', 'required', 'mandatory', 'essential',
    'must', 'necessary', 'compulsory', 'excellent', 'strong', 'advanced', 'very good',
    'business level', 'professional level', 'full professional', 'working knowledge',
    'c1', 'c2', 'b2',
    // German
    'fließend', 'sehr gut', 'ausgezeichnet', 'verhandlungssicher', 'muttersprachlich',
    'erforderlich', 'notwendig', 'zwingend', 'vorausgesetzt', 'kenntnisse', 'kompetenz',
    'sprachkenntnisse', 'sprachkompetenz', 'sprachfähigkeit', 'kommunikationsfähigkeit',
    // French
    'courant', 'maîtrise', 'natif', 'parfait', 'bilingue', 'couramment',
    // Spanish
    'fluido', 'nativo', 'dominio', 'bilingüe', 'imprescindible',
    // Dutch
    'vloeiend', 'uitstekend', 'beheersen', 'vaardigheid',
    // Italian
    'fluente', 'madrelingua', 'padronanza', 'ottima conoscenza',
    // Norwegian
    'flytende', 'utmerket', 'morsmål',
    // Finnish
    'sujuva', 'erinomainen', 'äidinkieli',
];

const PROXIMITY_OPTIONAL_SIGNALS = [
    'preferred', 'advantageous', 'advantage', 'nice to have', 'a plus', 'an asset',
    'desirable', 'beneficial', 'welcome', 'good', 'basic',
    'von vorteil', 'wünschenswert', 'bevorzugt', 'von vorteil',
    'souhaitable', 'apprécié', 'un atout',
    'valorable', 'deseable',
    'gewenst', 'een pre',
    'gradito', 'un plus',
    'ønskelig', 'en fordel',
    'eduksi', 'toivottavaa',
];

/**
 * Proximity check: finds language name in text and checks surrounding context
 * for required/optional signal words. Catches patterns like
 * "fluent in English and German" that exact phrases miss.
 *
 * @param {string} text - Full job description text
 * @param {string} langCode - e.g. "de"
 * @returns {{ status: 'required'|'optional'|'none', confidence: number, reason: string }}
 */
function checkLanguageProximity(text, langCode) {
    const names = LANGUAGE_NAME_VARIANTS[langCode];
    if (!names) return { status: 'none', confidence: 0, reason: '' };

    const lower = text.toLowerCase();
    const WINDOW = 120; // characters on each side of the language name

    for (const name of names) {
        let idx = lower.indexOf(name);
        while (idx !== -1) {
            const start = Math.max(0, idx - WINDOW);
            const end = Math.min(lower.length, idx + name.length + WINDOW);
            const context = lower.substring(start, end);

            for (const signal of PROXIMITY_REQUIRED_SIGNALS) {
                if (context.includes(signal)) {
                    return {
                        status: 'required',
                        confidence: 0.75,
                        reason: `"${name}" near "${signal}"`,
                    };
                }
            }
            for (const signal of PROXIMITY_OPTIONAL_SIGNALS) {
                if (context.includes(signal)) {
                    return {
                        status: 'optional',
                        confidence: 0.55,
                        reason: `"${name}" near "${signal}"`,
                    };
                }
            }

            idx = lower.indexOf(name, idx + 1);
        }
    }

    return { status: 'none', confidence: 0, reason: '' };
}


// If the job description IS written in a non-English language (e.g. entirely in
// French), that strongly implies the language is required even if no explicit
// "French required" keyword appears. We detect this by counting how many words
// in the text are high-frequency function words (stopwords) for each language.
//
// Threshold: if ≥12% of all tokens match a language's stopwords, that language
// is considered the document language → treated as required.

const LANGUAGE_STOPWORDS = {
    de: new Set([
        "und", "die", "der", "das", "von", "mit", "für", "sich", "auf", "ist", "des", "nicht",
        "bei", "eine", "einem", "einen", "oder", "auch", "hat", "werden", "dem", "den", "sie",
        "wir", "als", "an", "zu", "im", "es", "ich", "so", "aber", "wie", "noch", "wenn", "dann",
        "nach", "vor", "über", "bis", "durch", "haben", "kann", "wird", "sind", "war", "sein",
        "ihre", "ihrer", "unser", "ihrer", "alle", "mehr", "sehr", "aus", "nur", "uns", "man",
        "hier", "diese", "dieser", "dieses", "sowie", "werden", "wurde", "wurden", "ihre",
        "ihrer", "unsere", "unserer", "ihrer", "zum", "zur", "beim", "ins", "am", "vom",
    ]),
    fr: new Set([
        "le", "la", "les", "de", "du", "en", "et", "est", "une", "un", "que", "qui", "dans",
        "pour", "avec", "sur", "par", "vous", "nous", "il", "elle", "ils", "elles", "au", "aux",
        "mais", "ces", "ce", "cette", "des", "son", "sa", "ses", "leur", "leurs", "nos", "votre",
        "vos", "être", "avoir", "faire", "plus", "pas", "ne", "se", "on", "tout", "bien", "même",
        "aussi", "comme", "si", "car", "dont", "où", "quand", "alors", "très", "ou", "ni", "je",
        "nous", "vous", "eux", "mon", "ma", "mes", "ton", "ta", "tes", "notre", "vos", "leurs",
    ]),
    es: new Set([
        "de", "en", "el", "la", "que", "los", "las", "se", "un", "una", "del", "con", "por",
        "para", "como", "está", "son", "más", "fue", "al", "lo", "le", "si", "su", "sus", "nos",
        "les", "bien", "hay", "tiene", "pero", "ya", "ser", "estar", "este", "esta", "estos",
        "estas", "ese", "esa", "esos", "esas", "yo", "tú", "él", "ella", "nosotros", "ellos",
        "muy", "sin", "sobre", "entre", "después", "antes", "también", "cuando", "donde", "así",
    ]),
    nl: new Set([
        "van", "de", "het", "en", "een", "in", "is", "dat", "op", "te", "zijn", "met", "voor",
        "niet", "aan", "er", "worden", "bij", "ook", "wordt", "hij", "ze", "we", "je", "als",
        "uit", "heeft", "kan", "ging", "gaan", "naar", "door", "over", "maar", "dan", "wel",
        "om", "zo", "dit", "die", "der", "ons", "uw", "hun", "haar", "mijn", "zijn", "hun",
        "onze", "nog", "meer", "reeds", "toch", "juist", "steeds", "vaak", "soms", "altijd",
    ]),
    it: new Set([
        "di", "e", "la", "il", "che", "un", "a", "le", "per", "una", "del", "in", "non", "con",
        "si", "da", "è", "ha", "al", "lo", "nella", "nel", "i", "gli", "delle", "della", "alla",
        "sono", "anche", "come", "quando", "essere", "avere", "fare", "questo", "questa",
        "questi", "queste", "quello", "quella", "quelli", "quelle", "ci", "mi", "ti", "vi",
        "se", "più", "ma", "poi", "qui", "lì", "già", "sempre", "mai", "molto", "poco", "bene",
    ]),
    no: new Set([
        "og", "i", "av", "til", "med", "er", "som", "det", "for", "en", "på", "de", "at", "kan",
        "vi", "ikke", "å", "har", "om", "fra", "men", "den", "et", "seg", "sin", "dette", "disse",
        "bli", "skal", "vil", "alle", "mer", "etter", "over", "mot", "under", "uten", "bare",
        "når", "nå", "da", "så", "her", "der", "han", "hun", "dem", "oss", "dere", "deg", "meg",
    ]),
    fi: new Set([
        "ja", "on", "ei", "ole", "sekä", "että", "tai", "voi", "kun", "olla", "kaikki", "myös",
        "joka", "mikä", "hän", "se", "niin", "mutta", "tämä", "ovat", "hyvin", "työ", "osaaminen",
        "eri", "sen", "sen", "sen", "ne", "minä", "sinä", "hän", "me", "te", "he", "tämän",
        "tätä", "näitä", "niitä", "lisäksi", "kuten", "sekä", "joita", "joille", "joissa",
        "kanssa", "vuoksi", "takia", "siten", "joten", "vaikka", "ennen", "jälkeen", "ainoa",
    ]),
};

/**
 * Detect the dominant non-English language the job description is written in.
 * Returns the lang code (e.g. "de") if confident, or null if it looks English/ambiguous.
 *
 * @param {string} text - Full job description text
 * @returns {string|null} Lang code or null
 */
function detectDocumentLanguage(text) {
    if (!text || text.length < 100) return null;

    // Tokenize — letters including accented chars, at least 2 chars long
    const words = text.toLowerCase().match(/\b[a-züöäéèêëàâîïôùûçøåæœðþñíóúýőűıšžčćđ]{2,}\b/g);
    if (!words || words.length < 30) return null;

    const scores = {};
    for (const [code, stopwords] of Object.entries(LANGUAGE_STOPWORDS)) {
        let hits = 0;
        for (const word of words) {
            if (stopwords.has(word)) hits++;
        }
        scores[code] = hits / words.length;
    }

    // Pick the highest-scoring language
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [topCode, topScore] = sorted[0];

    // Must clear a minimum threshold AND be notably ahead of the runner-up
    const runnerUpScore = sorted[1] ? sorted[1][1] : 0;
    if (topScore >= 0.12 && topScore > runnerUpScore * 1.5) {
        return topCode;
    }
    return null;
}
