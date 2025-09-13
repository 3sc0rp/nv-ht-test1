// API endpoint for Nature Village Restaurant comprehensive menu system
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Comprehensive menu data with full multilingual support
    const menuData = {
      restaurant: {
        name: {
          en: 'Nature Village Restaurant',
          ar: 'مطعم قرية الطبيعة',
          fa: 'رستوران دهکده طبیعت',
          ku: 'چێشتخانەی گوندی سروشت',
          tr: 'Doğa Köyü Restoranı',
          ur: 'نیچر ولیج ریسٹورنٹ',
          kmr: 'Xwaringeha Gundê Xwezayê',
          es: 'Restaurante Nature Village',
          ru: 'Ресторан Природная деревня',
          hi: 'नेचर विलेज रेस्टोरेंट',
          sq: 'Restorant Nature Village',
          fr: 'Restaurant Nature Village',
          de: 'Nature Village Restaurant'
        },
        cuisine: 'Middle Eastern & Kurdish',
        location: 'Suwanee, Georgia'
      },
      items: [
        // APPETIZERS
        {
          id: 1001,
          name: {
            en: 'Hummus',
            ar: 'حمص',
            fa: 'حمص',
            ku: 'حممس',
            tr: 'Humus',
            ur: 'حمص',
            kmr: 'Humus',
            es: 'Hummus',
            fr: 'Houmous',
            de: 'Hummus',
            ru: 'Хумус',
            hi: 'हम्मुस',
            sq: 'Humus'
          },
          description: {
            en: 'A classic Middle Eastern dip made from mashed chickpeas, tahini, olive oil, lemon juice, and garlic.',
            ar: 'غموس شرق أوسطي كلاسيكي مصنوع من الحمص المهروس والطحينة وزيت الزيتون وعصير الليمون والثوم.',
            fa: 'یک دیپ کلاسیک خاورمیانه‌ای از نخود له شده، طحینی، روغن زیتون، آب لیمو و سیر.',
            ku: 'دیپێکی کلاسیکی ڕۆژهەڵاتی ناوەڕاست لە نۆکی کوتراو، تەحینی، زەیتی زەیتوون، شیری لیمۆ و سیر.',
            tr: 'Ezilmiş nohut, tahin, zeytinyağı, limon suyu ve sarımsaktan yapılan klasik Orta Doğu mezesi.',
            ur: 'چنے، تل کا پیسٹ، زیتون کا تیل، لیموں کا رس اور لہسن سے بنا کلاسک مشرق وسطیٰ کا ڈپ۔',
            kmr: 'Mezeyeke klasîk ya Rojhilatê Navîn ku ji kurskotan, tahînî, zeyta zeytûnê, ava lîmonê û sîr tê çêkirin.',
            es: 'Una salsa clásica de Oriente Medio hecha de garbanzos machacados, tahini, aceite de oliva, jugo de limón y ajo.',
            fr: 'Une trempette classique du Moyen-Orient à base de pois chiches écrasés, tahini, huile d\'olive, jus de citron et ail.',
            de: 'Ein klassischer nahöstlicher Dip aus zerdrückten Kichererbsen, Tahini, Olivenöl, Zitronensaft und Knoblauch.',
            ru: 'Классическая ближневосточная закуска из измельченного нута, тахини, оливкового масла, лимонного сока и чеснока.',
            hi: 'मसले हुए छोले, तिल का पेस्ट, जैतून का तेल, नींबू का रस और लहसुन से बना क्लासिक मध्य पूर्वी डिप।',
            sq: 'Një sos klasik i Lindjes së Mesme i bërë nga grofthat e shtypur, tahini, vaj ulliri, lëng limoni dhe hudhra.'
          },
          price: 8.50,
          category: 'appetizers',
          popular: true,
          available: true,
          allergens: ['sesame'],
          nutritionalInfo: {
            calories: 280,
            protein: 12,
            carbs: 24,
            fat: 18,
            fiber: 8
          },
          dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
          spiceLevel: 0,
          image: '/hummus.jpg'
        },
        {
          id: 1002,
          name: {
            en: 'Baba Ghanoush',
            ar: 'بابا غنوج',
            fa: 'بابا غنوش',
            ku: 'بابا غنوش',
            tr: 'Babaganuş',
            ur: 'بابا غنوش',
            kmr: 'Baba Ganuş',
            es: 'Baba Ghanoush',
            ru: 'Баба Гануш',
            hi: 'बाबा गनूश',
            sq: 'Baba Ghanoush',
            fr: 'Baba Ganouch',
            de: 'Baba Ghanoush'
          },
          description: {
            en: 'A Kurdish dip made from roasted eggplant, roasted tomatoes, peppers, fresh onions, parsley, mint, and pomegranate molasses dressing.',
            ar: 'غموس كردي مصنوع من الباذنجان المشوي والطماطم المشوية والفلفل والبصل الطازج والبقدونس والنعناع وصلصة دبس الرمان.',
            fa: 'یک دیپ کردی از بادمجان کبابی، گوجه کبابی، فلفل، پیاز تازه، جعفری، نعنا و سس انار.',
            ku: 'دیپێکی کوردی لە بادەمجانی برژاو، تەماتەی برژاو، بیبەر، پیازی تازە، جەعدە، پونگ و سۆسی هەنار.',
            tr: 'Közlenmiş patlıcan, közlenmiş domates, biber, taze soğan, maydanoz, nane ve nar ekşisi sosundan yapılan Kürt mezesi.',
            ur: 'بھنے ہوئے بینگن، بھنے ہوئے ٹماٹر، مرچ، تازہ پیاز، دھنیا، پودینہ اور انار کے شیرے سے بنا کردش ڈپ۔',
            kmr: 'Mezeyeke Kurdî ya ku ji bacanê şewitî, firangoşê şewitî, biber, pîvazên taze, şînî, pûng û soşa henarê tê çêkirin.',
            es: 'Una salsa kurda hecha de berenjena asada, tomates asados, pimientos, cebollas frescas, perejil, menta y aderezo de melaza de granada.',
            ru: 'Курдская закуска из жареных баклажанов, жареных помидоров, перца, свежего лука, петрушки, мяты и заправки из гранатовой патоки.',
            hi: 'भुने हुए बैंगन, भुने हुए टमाटर, मिर्च, ताज़ा प्याज, अजमोद, पुदीना और अनार के गुड़ की ड्रेसिंग से बना कुर्दिश डिप।',
            sq: 'Një sos kurd i bërë nga patëllxhanë të pjekura, domate të pjekura, speca, qepë të freskëta, majdanoz, mendër dhe sos melasë shege.',
            fr: 'Une trempette kurde à base d\'aubergines grillées, tomates grillées, poivrons, oignons frais, persil, menthe et vinaigrette à la mélasse de grenade.',
            de: 'Ein kurdischer Dip aus gerösteten Auberginen, gerösteten Tomaten, Paprika, frischen Zwiebeln, Petersilie, Minze und Granatapfelmelasse-Dressing.'
          },
          price: 8.50,
          category: 'appetizers',
          popular: true,
          available: true,
          allergens: ['none'],
          nutritionalInfo: {
            calories: 240,
            protein: 6,
            carbs: 18,
            fat: 16,
            fiber: 12
          },
          dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
          spiceLevel: 1,
          image: '/Baba Ghanoush.jpg'
        },
        {
          id: 1003,
          name: {
            en: 'Kibbeh',
            ar: 'كبة',
            fa: 'کبه',
            ku: 'کبه',
            tr: 'Kibbeh',
            ur: 'کبہ',
            kmr: 'Kibbeh',
            es: 'Kibbeh',
            ru: 'Кеббе',
            hi: 'किब्बेह',
            sq: 'Kibbeh',
            fr: 'Kibbeh',
            de: 'Kibbeh'
          },
          description: {
            en: 'A Middle Eastern classic with a crispy outer shell made from finely ground rice and spices, encasing a flavorful minced meat filling. Fried to perfection.',
            ar: 'كلاسيكية شرق أوسطية بقشرة خارجية مقرمشة مصنوعة من الأرز المطحون ناعماً والبهارات، تحتوي على حشوة لحم مفروم نكهة. مقلية إلى الكمال.',
            fa: 'یک کلاسیک خاورمیانه‌ای با پوسته بیرونی ترد از برنج آسیاب شده و ادویه‌جات، حاوی گوشت چرخ کرده طعم‌دار. سرخ شده تا کمال.',
            ku: 'کلاسیکێکی ڕۆژهەڵاتی ناوەڕاست بە قاڵبێکی دەرەوەی ترسکە لە برنجی وردکراو و بەهارات، دەوری گۆشتی وردکراوی بەتام دەگرێت. بە تەواوی سوورکراوە.',
            tr: 'İnce öğütülmüş pirinç ve baharatlardan yapılan çıtır dış kabuğu olan, lezzetli kıyma doldurulmuş Orta Doğu klasiği. Mükemmelliğe kadar kızartılmış.',
            ur: 'باریک پسے ہوئے چاول اور مصالحوں سے بنا کرسپی بیرونی خول کے ساتھ مشرق وسطیٰ کا کلاسک، جس میں ذائقہ دار قیمہ بھرا ہوا ہے۔ کمال تک تلا ہوا۔',
            kmr: 'Klasîkeke Rojhilatê Navîn bi kabrikek derve yê çitir ku ji brincê xweş hatî hêsandin û baharatan hatî çêkirin, ku goştê hûrkirî yê bi tam tê de hatiye dagirtin.',
            es: 'Un clásico de Medio Oriente con una cáscara exterior crujiente hecha de arroz finamente molido y especias, envolviendo un relleno de carne picada sabrosa.',
            ru: 'Классическое ближневосточное блюдо с хрустящей внешней оболочкой из мелко молотого риса и специй, с начинкой из ароматного рубленого мяса.',
            hi: 'बारीक पिसे चावल और मसालों से बना कुरकुरा बाहरी आवरण के साथ मध्य पूर्वी क्लासिक, जिसमें स्वादिष्ट कीमा भरा होता है।',
            sq: 'Një klasik i Lindjes së Mesme me një lëvore të jashtme të krisur e bërë nga orizi i bluar imët dhe erëza, që mban një mbushje mishi të grirë plot shije.',
            fr: 'Un classique du Moyen-Orient avec une coquille extérieure croustillante faite de riz finement moulu et d\'épices, renfermant une farce de viande hachée savoureuse.',
            de: 'Ein nahöstlicher Klassiker mit knuspriger äußerer Hülle aus fein gemahlenem Reis und Gewürzen, gefüllt mit würzigem Hackfleisch.'
          },
          price: 9.99,
          category: 'appetizers',
          popular: true,
          available: true,
          allergens: ['gluten'],
          nutritionalInfo: {
            calories: 420,
            protein: 24,
            carbs: 28,
            fat: 22,
            fiber: 4
          },
          dietaryTags: [],
          spiceLevel: 2,
          image: '/Kibbeh.jpg'
        },
        
        // GRILL PLATTERS
        {
          id: 1801,
          name: {
            en: 'Erbil Shish Kabab',
            ar: 'شيش كباب أربيل',
            fa: 'شیش کباب اربیل',
            ku: 'شیش کەبابی هەولێر',
            tr: 'Erbil Şiş Kebap',
            ur: 'اربیل شیش کباب',
            kmr: 'Şîş Kebaba Hewlêrê',
            es: 'Shish Kabab de Erbil',
            ru: 'Эрбильский шиш-кебаб',
            hi: 'एर्बिल शीश कबाब',
            sq: 'Shish Kabab Erbil',
            fr: 'Shish Kebab d\'Erbil',
            de: 'Erbil Shish Kebab'
          },
          description: {
            en: 'Tender chunks of marinated lamb, grilled to perfection and served with aromatic basmati rice, grilled vegetables, and our signature sauce.',
            ar: 'قطع طرية من لحم الخروف المتبل، مشوية إلى الكمال وتُقدم مع أرز البسمتي العطر والخضروات المشوية وصلصتنا المميزة.',
            fa: 'تکه‌های نرم گوشت بره مزه‌دار، کباب شده تا کمال و با برنج معطر باسماتی، سبزیجات کبابی و سس مخصوص ما سرو می‌شود.',
            ku: 'پارچە نەرمەکانی گۆشتی بەرخی تامدراو، برژاو بۆ تەواوی و لەگەڵ برنجی باسماتی بۆنخۆش، سەوزەی برژاو و سۆسی تایبەتمان.',
            tr: 'Marine edilmiş yumuşak kuzu eti parçaları, mükemmelliğe kadar ızgarada pişirilerek aromatik basmati pilavı, ızgara sebzeler ve özel sosumuzla servis edilir.',
            ur: 'میرینیٹ شدہ بھیڑ کے نرم ٹکڑے، کمال تک گرل کیے گئے اور خوشبودار باسماتی چاول، گرل شدہ سبزیوں اور ہماری خاص ساس کے ساتھ پیش کیے گئے۔',
            kmr: 'Perçeyên nerm ên goştê berxê marînekirî, heta temamî li ser agrê hatine pijandin û bi brincê basmati yê bêhnxweş, sebzeyên agrkirî û soşa me ya taybetî tên peşkêşkirin.',
            es: 'Trozos tiernos de cordero marinado, asados a la perfección y servidos con arroz basmati aromático, verduras asadas y nuestra salsa exclusiva.',
            ru: 'Нежные кусочки маринованной баранины, приготовленные на гриле до совершенства и поданные с ароматным рисом басмати, овощами гриль и нашим фирменным соусом.',
            hi: 'मैरिनेटेड भेड़ के नरम टुकड़े, पूर्णता तक ग्रिल किए गए और सुगंधित बासमती चावल, ग्रिल्ड सब्जियों और हमारी विशेष सॉस के साथ परोसे गए।',
            sq: 'Copa të buta të delsë së marinuar, të pjekura në perfeksion dhe të shërbyera me oriz basmati aromatik, perime të pjekura dhe salcën tonë unike.',
            fr: 'Morceaux tendres d\'agneau mariné, grillés à la perfection et servis avec du riz basmati aromatique, des légumes grillés et notre sauce signature.',
            de: 'Zarte Stücke marinierten Lamms, perfekt gegrillt und serviert mit aromatischem Basmati-Reis, gegrilltem Gemüse und unserer charakteristischen Sauce.'
          },
          price: 22.99,
          category: 'grill',
          popular: true,
          available: true,
          allergens: ['none'],
          nutritionalInfo: {
            calories: 580,
            protein: 42,
            carbs: 35,
            fat: 28,
            fiber: 6
          },
          dietaryTags: ['gluten-free'],
          spiceLevel: 2,
          image: '/Erbil Shish Kabab.jpg'
        },
        {
          id: 1802,
          name: {
            en: 'Mahshi Kabab',
            ar: 'كباب محشي',
            fa: 'کباب محشی',
            ku: 'کەبابی پڕکراوە',
            tr: 'Mahşi Kebap',
            ur: 'محشی کباب',
            kmr: 'Kebaba Dagirtî',
            es: 'Mahshi Kabab',
            ru: 'Махши Кебаб',
            hi: 'महशी कबाब',
            sq: 'Mahshi Kabab',
            fr: 'Kebab Mahshi',
            de: 'Mahshi Kebab'
          },
          description: {
            en: 'Beef and lamb kabab flavored with garlic, spicy peppers, and parsley. A signature dish with bold flavors and perfectly balanced spices.',
            ar: 'كباب لحم بقر وخروف منكه بالثوم والفلفل الحار والبقدونس. طبق مميز بنكهات جريئة وتوابل متوازنة تماماً.',
            fa: 'کباب گوشت گاو و بره با طعم سیر، فلفل تند و جعفری. غذای مخصوص با طعم‌های قوی و ادویه‌جات کاملاً متعادل.',
            ku: 'کەبابی گۆشتی گا و بەرخ بە تامی سیر، بیبەری تەند و جەعدە. خۆراکێکی تایبەت بە تامە بەهێزەکان و بەهاراتی تەواو هاوسەنگ.',
            tr: 'Sarımsak, acı biber ve maydanozla tatlandırılmış dana ve kuzu kebap. Cesur lezzetler ve mükemmel dengeli baharatlarla özel bir yemek.',
            ur: 'لہسن، تیز مرچ اور دھنیے سے ذائقہ دار گائے اور بھیڑ کا کباب۔ جرات مندانہ ذائقوں اور مکمل طور پر متوازن مصالحوں کے ساتھ ایک خاص ڈش۔',
            kmr: 'Kebaba goştê ga û berxî ya bi sîr, biberên tûj û şînî hatiye tamdar kirin. Xwarineke taybetî bi tamên xurt û baharatên bi tevahî hevseng.',
            es: 'Kabab de carne de res y cordero sazonado con ajo, pimientos picantes y perejil. Un plato exclusivo con sabores audaces y especias perfectamente equilibradas.',
            ru: 'Кебаб из говядины и баранины с чесноком, острым перцем и петрушкой. Фирменное блюдо с яркими вкусами и идеально сбалансированными специями.',
            hi: 'लहसुन, तेज़ मिर्च और अजमोद के साथ गोमांस और भेड़ के बच्चे का कबाब। बोल्ड स्वाद और पूर्णतः संतुलित मसालों के साथ एक विशेष व्यंजन।',
            sq: 'Kabab viçi dhe deleje me shije hudhra, speca të egos dhe majdanoz. Një pjatë unike me shije të guximshme dhe erëza të balancuara në mënyrë të përsosur.',
            fr: 'Kebab de bœuf et d\'agneau assaisonné à l\'ail, aux piments forts et au persil. Un plat signature aux saveurs audacieuses et aux épices parfaitement équilibrées.',
            de: 'Rind- und Lamm-Kebab gewürzt mit Knoblauch, scharfen Paprika und Petersilie. Ein charakteristisches Gericht mit kräftigen Aromen und perfekt ausgewogenen Gewürzen.'
          },
          price: 21.99,
          category: 'grill',
          popular: true,
          available: true,
          allergens: ['none'],
          nutritionalInfo: {
            calories: 620,
            protein: 45,
            carbs: 28,
            fat: 32,
            fiber: 4
          },
          dietaryTags: ['gluten-free'],
          spiceLevel: 3,
          image: '/mkabab.jpg'
        },

        // SPECIALTY DISHES
        {
          id: 1701,
          name: {
            en: 'Middle Eastern Style Parda Biryani',
            ar: 'برياني برده بالطريقة الشرق أوسطية',
            fa: 'برانی پرده به سبک خاورمیانه',
            ku: 'برانیی پەردەی شێوازی ڕۆژهەڵاتی ناوەڕاست',
            tr: 'Orta Doğu Tarzı Perde Biryani',
            ur: 'مشرق وسطیٰ کے انداز میں پردہ بریانی',
            kmr: 'Bîryaniya Perde ya Şêwaza Rojhilatê Navîn',
            es: 'Biryani Parda Estilo Medio Oriente',
            ru: 'Парда Бирьяни в ближневосточном стиле',
            hi: 'मध्य पूर्वी शैली का परदा बिरयानी',
            sq: 'Parda Biryani Stil Lindja e Mesme',
            fr: 'Biryani Parda Style Moyen-Orient',
            de: 'Nahöstlicher Parda Biryani'
          },
          description: {
            en: 'Traditional layered rice dish with aromatic spices and tender meat, slow-cooked to perfection. A royal feast that represents the finest of Middle Eastern cuisine.',
            ar: 'طبق أرز طبقي تقليدي بالتوابل العطرية واللحم الطري، مطبوخ ببطء إلى الكمال. وليمة ملكية تمثل أفضل ما في المطبخ الشرق أوسطي.',
            fa: 'غذای سنتی برنج لایه‌ای با ادویه‌جات معطر و گوشت نرم، آهسته پخته شده تا کمال. ضیافتی شاهانه که نمایانگر بهترین غذاهای خاورمیانه است.',
            ku: 'خۆراکی نەریتی برنجی چینە چینە لەگەڵ بەهاراتی بۆنخۆش و گۆشتی نەرم، بە هێواشی لێنراو بۆ تەواوی. خوانێکی شاهانە کە باشترین ئاشپەزی ڕۆژهەڵاتی ناوەڕاست نوێنەرایەتی دەکات.',
            tr: 'Aromatik baharat ve yumuşak etle geleneksel katmanlı pirinç yemeği, mükemmelliğe kadar yavaş pişirilmiş. Orta Doğu mutfağının en iyisini temsil eden kraliyet ziyafeti.',
            ur: 'خوشبودار مصالحوں اور نرم گوشت کے ساتھ روایتی تہدار چاول کا کھانا، کمال تک آہستہ پکایا گیا۔ ایک شاہی دعوت جو مشرق وسطیٰ کے بہترین کھانوں کی نمائندگی کرتی ہے۔',
            kmr: 'Xwarinê kevneşopî ya brincê çîndar bi baharatên bêhnxweş û goştê nerm, bi hêdî hatiye pijandin heta temamî. Zîyafetek şahî ya ku çêtirîn aşpêjiya Rojhilatê Navîn temsîl dike.',
            es: 'Plato tradicional de arroz en capas con especias aromáticas y carne tierna, cocinado lentamente a la perfección. Un banquete real que representa lo mejor de la cocina de Oriente Medio.',
            ru: 'Традиционное слоёное рисовое блюдо с ароматными специями и нежным мясом, медленно приготовленное до совершенства. Королевский пир, представляющий лучшее из ближневосточной кухни.',
            hi: 'सुगंधित मसालों और नरम मांस के साथ पारंपरिक परतदार चावल का व्यंजन, पूर्णता तक धीमी गति से पकाया गया। एक शाही दावत जो मध्य पूर्वी व्यंजनों के सर्वोत्तम का प्रतिनिधित्व करती है।',
            sq: 'Pjatë tradicionale orizi me shtresa me erëza aromatike dhe mish të butë, gatuar ngadalë deri në përsosmëri. Një banket mbretëror që përfaqëson më të mirën e kuzhinës së Lindjes së Mesme.',
            fr: 'Plat traditionnel de riz en couches avec des épices aromatiques et de la viande tendre, cuit lentement à la perfection. Un festin royal qui représente le meilleur de la cuisine moyen-orientale.',
            de: 'Traditionelles Schichtreisgericht mit aromatischen Gewürzen und zartem Fleisch, langsam zur Perfektion gekocht. Ein königliches Festmahl, das das Beste der nahöstlichen Küche repräsentiert.'
          },
          price: 24.99,
          category: 'specialty',
          popular: true,
          available: true,
          allergens: ['dairy'],
          nutritionalInfo: {
            calories: 680,
            protein: 38,
            carbs: 65,
            fat: 26,
            fiber: 8
          },
          dietaryTags: ['gluten-free'],
          spiceLevel: 2,
          servingSize: '2-3 people',
          image: '/pbiryani.png'
        },

        // DESSERTS
        {
          id: 2201,
          name: {
            en: 'Baklava',
            ar: 'بقلاوة',
            fa: 'باقلوا',
            ku: 'بەقلاوا',
            tr: 'Baklava',
            ur: 'بقلاوہ',
            kmr: 'Beqlawa',
            es: 'Baklava',
            ru: 'Баклава',
            hi: 'बकलावा',
            sq: 'Bakllava',
            fr: 'Baklava',
            de: 'Baklava'
          },
          description: {
            en: 'Sweet pastry with layers of nuts and honey in delicate phyllo dough. A traditional Middle Eastern dessert that melts in your mouth.',
            ar: 'معجنات حلوة مع طبقات من المكسرات والعسل في عجينة فيلو الرقيقة. حلوى شرق أوسطية تقليدية تذوب في فمك.',
            fa: 'شیرینی خمیری با لایه‌هایی از آجیل و عسل در خمیر فیلوی ظریف. دسر سنتی خاورمیانه‌ای که در دهان آب می‌شود.',
            ku: 'شیرینییەکی خەمیری لەگەڵ چینە چینە گوێز و هەنگوین لە خەمیری فیلۆی ناسک. شیرینییەکی نەریتی ڕۆژهەڵاتی ناوەڕاست کە لە دەمدا دەتوێتەوە.',
            tr: 'İnce yufka içinde fındık ve bal katmanları ile tatlı hamur işi. Ağzınızda eriyen geleneksel Orta Doğu tatlısı.',
            ur: 'نازک فیلو آٹے میں گری اور شہد کی تہوں کے ساتھ میٹھی پیسٹری۔ ایک روایتی مشرق وسطیٰ کی میٹھائی جو آپ کے منہ میں پگھل جاتی ہے۔',
            kmr: 'Pîrokek şîrîn bi çînên gûz û hingivê di hêvîrê fîloya nazik de. Şîrîniyeke kevneşopî ya Rojhilatê Navîn ya ku di devê de diherim.',
            es: 'Dulce hojaldre con capas de nueces y miel en delicada masa filo. Un postre tradicional de Oriente Medio que se derrite en la boca.',
            ru: 'Сладкое пирожное со слоями орехов и мёда в нежном тесте фило. Традиционный ближневосточный десерт, который тает во рту.',
            hi: 'नाजुक फिलो आटे में नट्स और शहद की परतों के साथ मीठी पेस्ट्री। एक पारंपरिक मध्य पूर्वी मिठाई जो आपके मुंह में घुल जाती है।',
            sq: 'Ëmbëlsirë me shtresa arrash dhe mjaltë në brumë delikat fillo. Një ëmbëlsirë tradicionale e Lindjes së Mesme që shkrihet në gojë.',
            fr: 'Pâtisserie sucrée avec des couches de noix et de miel dans une délicate pâte phyllo. Un dessert traditionnel moyen-oriental qui fond en bouche.',
            de: 'Süßes Gebäck mit Nuss- und Honigschichten in zartem Phyllo-Teig. Ein traditionelles nahöstliches Dessert, das auf der Zunge zergeht.'
          },
          price: 6.99,
          category: 'dessert',
          popular: true,
          available: true,
          allergens: ['nuts', 'gluten'],
          nutritionalInfo: {
            calories: 320,
            protein: 8,
            carbs: 45,
            fat: 14,
            fiber: 3
          },
          dietaryTags: ['vegetarian'],
          spiceLevel: 0,
          image: '/baklava.jpg'
        },
        {
          id: 2202,
          name: {
            en: 'Baklava with Saffron Ice Cream',
            ar: 'بقلاوة مع آيس كريم الزعفران',
            fa: 'باقلوا با بستنی زعفرانی',
            ku: 'بەقلاوا لەگەڵ بەستەنی زەعفەران',
            tr: 'Safran Dondurmali Baklava',
            ur: 'زعفران آئس کریم کے ساتھ بقلاوہ',
            kmr: 'Beqlawa bi Bendava Zeferanê',
            es: 'Baklava con Helado de Azafrán',
            ru: 'Баклава с шафрановым мороженым',
            hi: 'केसर आइसक्रीम के साथ बकलावा',
            sq: 'Bakllava me Akullore Shafrani',
            fr: 'Baklava avec Glace au Safran',
            de: 'Baklava mit Safran-Eis'
          },
          description: {
            en: 'Our signature baklava served warm with a scoop of house-made saffron ice cream. The perfect blend of warm and cold, sweet and aromatic.',
            ar: 'بقلاوتنا المميزة تُقدم دافئة مع كرة من آيس كريم الزعفران المصنوع في البيت. المزيج المثالي من الدافئ والبارد، الحلو والعطر.',
            fa: 'باقلوای مخصوص ما که گرم با یک اسکوپ بستنی زعفرانی خانگی سرو می‌شود. ترکیب کاملی از گرم و سرد، شیرین و معطر.',
            ku: 'بەقلاواى تایبەتمان کە گەرم لەگەڵ گۆپکەیەک بەستەنی زەعفەرانی ماڵەوە دروستکراو دەخرێتە سەر. تێکەڵەیەکی تەواو لە گەرم و سارد، شیرین و بۆنخۆش.',
            tr: 'Ev yapımı safran dondurması ile sıcak servis edilen özel baklavamız. Sıcak ve soğuk, tatlı ve aromatik mükemmel karışım.',
            ur: 'ہمارا خاص بقلاوہ جو گھر میں بنی زعفران آئس کریم کے اسکوپ کے ساتھ گرم پیش کیا جاتا ہے۔ گرم اور ٹھنڈے، میٹھے اور خوشبودار کا کامل امتزاج۔',
            kmr: 'Beqlawa me ya taybetî ya ku bi germahî bi golikek bendava zeferanê ya malê hatiye çêkirin tê peşkêşkirin. Tevahiya bêkêmasî ya germ û sar, şîrîn û bêhnxweş.',
            es: 'Nuestro baklava exclusivo servido caliente con una bola de helado de azafrán hecho en casa. La mezcla perfecta de caliente y frío, dulce y aromático.',
            ru: 'Наша фирменная баклава, подаваемая тёплой с шариком домашнего шафранового мороженого. Идеальное сочетание тёплого и холодного, сладкого и ароматного.',
            hi: 'हमारा विशेष बकलावा जो घर में बनी केसर आइसक्रीम के स्कूप के साथ गर्म परोसा जाता है। गर्म और ठंडे, मीठे और सुगंधित का सही मिश्रण।',
            sq: 'Bakllava jonë unike e shërbyer e ngrohtë me një top akullore shafrani të bërë në shtëpi. Përzierja e përsosur e të ngrohtit dhe të ftohtit, të ëmbëlit dhe aromatik.',
            fr: 'Notre baklava signature servi chaud avec une boule de glace au safran maison. Le mélange parfait de chaud et froid, sucré et aromatique.',
            de: 'Unser charakteristisches Baklava, warm serviert mit einer Kugel hausgemachten Safran-Eises. Die perfekte Mischung aus warm und kalt, süß und aromatisch.'
          },
          price: 9.99,
          category: 'dessert',
          popular: true,
          available: true,
          allergens: ['nuts', 'gluten', 'dairy'],
          nutritionalInfo: {
            calories: 480,
            protein: 12,
            carbs: 58,
            fat: 22,
            fiber: 4
          },
          dietaryTags: ['vegetarian'],
          spiceLevel: 0,
          image: '/Baklava with Saffron Ice Cream.jpg'
        },

        // SANDWICH & PLATTER ITEMS
        {
          id: 1301,
          name: {
            en: 'Iraqi Guss Wrap',
            ar: 'لفافة الگوس العراقي',
            fa: 'راپ گوس عراقی',
            ku: 'ڕاپی گووسی عێراقی',
            tr: 'Irak Guss Sarma',
            ur: 'عراقی گس ریپ',
            kmr: 'Pêçana Gûsê Îraqî',
            es: 'Wrap Guss Iraquí',
            ru: 'Иракская обёртка Гусс',
            hi: 'इराकी गुस रैप',
            sq: 'Mbështjellës Guss Irakian',
            fr: 'Wrap Guss Irakien',
            de: 'Irakischer Guss Wrap'
          },
          description: {
            en: 'Thinly sliced and seasoned beef wrap served with fresh vegetables and our special sauce.',
            ar: 'لفافة لحم البقر المقطعة رقيقاً والمتبلة تُقدم مع خضروات طازجة وصلصتنا الخاصة.',
            fa: 'راپ گوشت گاو نازک برش و طعم‌دار شده با سبزیجات تازه و سس مخصوص ما سرو می‌شود.',
            ku: 'ڕاپی گۆشتی گای باریک پارچەکراو و تامدراو لەگەڵ سەوزەی تازە و سۆسی تایبەتمان.',
            tr: 'İnce dilimlenmiş ve baharatlanmış sığır eti sarması, taze sebzeler ve özel sosumuzla servis edilir.',
            ur: 'باریک کٹا اور مصالحہ دار بیف ریپ تازہ سبزیوں اور ہماری خاص ساس کے ساتھ پیش کیا جاتا ہے۔',
            kmr: 'Pêçankên goştê ga yên zok perçe û bi baharatan bi sebzeyên taze û soşa me ya taybetî tê peşkêşkirin.',
            es: 'Wrap de carne de res finamente rebanada y sazonada servido con verduras frescas y nuestra salsa especial.',
            ru: 'Говяжья лепешка, тонко нарезанная и приправленная, подается со свежими овощами и нашим особым соусом.',
            hi: 'पतली कटी और मसालेदार बीफ रैप ताज़ी सब्जियों और हमारी विशेष सॉस के साथ परोसी जाती है।',
            sq: 'Wrap viçi i prerë hollë dhe i erëzuar i shërbyer me perime të freskëta dhe salcën tonë të veçantë.',
            fr: 'Wrap de bœuf finement tranché et assaisonné servi avec des légumes frais et notre sauce spéciale.',
            de: 'Dünn geschnittener und gewürzter Rind-Wrap serviert mit frischem Gemüse und unserer besonderen Sauce.'
          },
          price: 15.99,
          variants: {
            sandwich: 15.99,
            platter: 17.99
          },
          category: 'sandwich_platter',
          popular: true,
          available: true,
          allergens: ['gluten'],
          nutritionalInfo: {
            calories: 520,
            protein: 28,
            carbs: 42,
            fat: 24,
            fiber: 6
          },
          dietaryTags: [],
          spiceLevel: 2,
          image: '/Iraqi Guss Wrap.jpg'
        },
        {
          id: 1302,
          name: {
            en: 'Chicken Wrap',
            ar: 'لفافة الدجاج',
            fa: 'راپ مرغ',
            ku: 'ڕاپی مریشک',
            tr: 'Tavuk Sarma',
            ur: 'چکن ریپ',
            kmr: 'Pêçana Mirîşk',
            es: 'Wrap de Pollo',
            ru: 'Куриная лепешка',
            hi: 'चिकन रैप',
            sq: 'Mbështjellës Pule',
            fr: 'Wrap au Poulet',
            de: 'Hähnchen Wrap'
          },
          description: {
            en: 'Tender marinated chicken wrapped in fresh pita with vegetables and our house sauce.',
            ar: 'دجاج متبل طري ملفوف في خبز البيتا الطازج مع الخضروات وصلصة البيت.',
            fa: 'مرغ مزه‌دار نرم پیچیده در نان پیتای تازه با سبزیجات و سس خانگی ما.',
            ku: 'مریشکی نەرمی تامدراو لە نانی پیتای تازە پێچراوەتەوە لەگەڵ سەوزە و سۆسی ماڵەوەمان.',
            tr: 'Taze pidede sebze ve ev sosumuzla sarılmış yumuşak marine tavuk.',
            ur: 'تازہ پیٹا میں سبزیوں اور ہماری گھریلو ساس کے ساتھ لپیٹا گیا نرم میرینیٹ چکن۔',
            kmr: 'Mirîşkê nerm ê marînekirî di nanê pita yê taze de bi sebze û soşa malê hatiye pêçandin.',
            es: 'Pollo marinado tierno envuelto en pita fresca con verduras y nuestra salsa casera.',
            ru: 'Нежная маринованная курица, завёрнутая в свежую питу с овощами и нашим домашним соусом.',
            hi: 'सब्जियों और हमारी घरेलू सॉस के साथ ताजा पीटा में लपेटा गया नर्म मैरिनेटेड चिकन।',
            sq: 'Pulë e butë e marinuar e mbështjellë në pita të freskët me perime dhe salcën tonë të shtëpisë.',
            fr: 'Poulet mariné tendre enroulé dans du pain pita frais avec des légumes et notre sauce maison.',
            de: 'Zartes mariniertes Hähnchen in frischem Pita mit Gemüse und unserer Haussoße eingewickelt.'
          },
          price: 14.99,
          variants: {
            sandwich: 14.99,
            platter: 16.99
          },
          category: 'sandwich_platter',
          popular: true,
          available: true,
          allergens: ['gluten'],
          nutritionalInfo: {
            calories: 480,
            protein: 32,
            carbs: 38,
            fat: 18,
            fiber: 5
          },
          dietaryTags: [],
          spiceLevel: 1,
          image: '/Chicken Wrap.jpg'
        },

        // PIZZA
        {
          id: 1401,
          name: {
            en: 'Kurdish Pizza',
            ar: 'بيتزا كردية',
            fa: 'پیتزا کردی',
            ku: 'پیتزای کوردی',
            tr: 'Kürt Pizzası',
            ur: 'کردش پیزا',
            kmr: 'Pizza Kurdî',
            es: 'Pizza Kurda',
            ru: 'Курдская пицца',
            hi: 'कुर्दिश पिज्जा',
            sq: 'Pica Kurde',
            fr: 'Pizza Kurde',
            de: 'Kurdische Pizza'
          },
          description: {
            en: 'Traditional Kurdish-style pizza with spiced ground meat, fresh herbs, and our special cheese blend.',
            ar: 'بيتزا تقليدية بالطريقة الكردية مع لحم مفروم متبل وأعشاب طازجة ومزيج الجبن الخاص بنا.',
            fa: 'پیتزا سنتی به سبک کردی با گوشت چرخ کرده ادویه‌دار، سبزیجات تازه و ترکیب پنیر مخصوص ما.',
            ku: 'پیتزای نەریتی بە شێوەی کوردی لەگەڵ گۆشتی وردکراوی بەهاراتدار، گیای تازە و تێکەڵەی پەنیری تایبەتمان.',
            tr: 'Baharatlı kıyma, taze otlar ve özel peynir karışımımızla geleneksel Kürt usulü pizza.',
            ur: 'مصالحہ دار قیمہ، تازہ جڑی بوٹیوں اور ہمارے خاص پنیر کے مرکب کے ساتھ روایتی کردش طرز کا پیزا۔',
            kmr: 'Pizza kevneşopî bi şêwaza Kurdî bi goştê hûrkirî yê bi baharatan, giyayên taze û tevahiya pênirê me ya taybetî.',
            es: 'Pizza tradicional estilo kurdo con carne molida especiada, hierbas frescas y nuestra mezcla especial de quesos.',
            ru: 'Традиционная курдская пицца с пряным фаршем, свежими травами и нашей особой сырной смесью.',
            hi: 'मसालेदार कीमा, ताज़ी जड़ी-बूटियों और हमारे विशेष चीज़ मिश्रण के साथ पारंपरिक कुर्दिश शैली का पिज्जा।',
            sq: 'Pica tradicionale në stil kurd me mish të grirë me erëza, bimë të freskëta dhe përzierjen tonë të veçantë të djathit.',
            fr: 'Pizza traditionnelle de style kurde avec de la viande hachée épicée, des herbes fraîches et notre mélange de fromages spéciaux.',
            de: 'Traditionelle kurdische Pizza mit gewürztem Hackfleisch, frischen Kräutern und unserer besonderen Käsemischung.'
          },
          price: 16.99,
          category: 'pizza',
          popular: true,
          available: true,
          allergens: ['gluten', 'dairy'],
          nutritionalInfo: {
            calories: 640,
            protein: 28,
            carbs: 52,
            fat: 34,
            fiber: 4
          },
          dietaryTags: [],
          spiceLevel: 2,
          image: '/kpizza.jpg'
        },

        // DRINKS
        {
          id: 2101,
          name: {
            en: 'Erbil Yogurt Drink',
            ar: 'مشروب الزبادي الأربيلي',
            fa: 'نوشیدنی ماست اربیل',
            ku: 'خواردنەوەی مۆستی هەولێر',
            tr: 'Erbil Yoğurt İçeceği',
            ur: 'اربیل یگرٹ ڈرنک',
            kmr: 'Vexwarina Mastê Hewlêrê',
            es: 'Bebida de Yogur de Erbil',
            ru: 'Эрбильский йогуртовый напиток',
            hi: 'एर्बिल दही पेय',
            sq: 'Pije Kosi Erbil',
            fr: 'Boisson au Yaourt d\'Erbil',
            de: 'Erbil Joghurt-Getränk'
          },
          description: {
            en: 'Refreshing traditional yogurt drink with mint and a hint of salt. Perfect complement to spicy dishes.',
            ar: 'مشروب زبادي تقليدي منعش بالنعناع ولمسة من الملح. مكمل مثالي للأطباق الحارة.',
            fa: 'نوشیدنی سنتی تازه‌کننده ماست با نعنا و کمی نمک. مکمل کاملی برای غذاهای تند.',
            ku: 'خواردنەوەی نەریتی سەرینکەرەوەی مۆست لەگەڵ پونگ و کەمێک خوێ. تەواوکەری تەواو بۆ خۆراکی تەند.',
            tr: 'Nane ve bir tutam tuzla geleneksel ferahlatıcı yoğurt içeceği. Baharatlı yemeklerin mükemmel tamamlayıcısı.',
            ur: 'پودینہ اور ذرا سا نمک کے ساتھ تازگی بخش روایتی دہی کا مشروب۔ تیز کھانوں کے لیے بہترین ضمیمہ۔',
            kmr: 'Vexwarina kevneşopî ya mastê ya serinkar bi pûng û hinekî xwê. Temamkera bêkêmasî ya xwarinên tûj.',
            es: 'Refrescante bebida tradicional de yogur con menta y una pizca de sal. Complemento perfecto para platos picantes.',
            ru: 'Освежающий традиционный йогуртовый напиток с мятой и щепоткой соли. Идеальное дополнение к острым блюдам.',
            hi: 'पुदीना और थोड़े से नमक के साथ ताज़गी देने वाला पारंपरिक दही पेय। मसालेदार व्यंजनों का सही साथी।',
            sq: 'Pije tradicionale e freskët kosi me mendër dhe një majë kripe. Komplement i përsosur për pjatat djegëse.',
            fr: 'Boisson traditionnelle rafraîchissante au yaourt avec de la menthe et une pointe de sel. Complément parfait pour les plats épicés.',
            de: 'Erfrischendes traditionelles Joghurt-Getränk mit Minze und einer Prise Salz. Perfekte Ergänzung zu würzigen Gerichten.'
          },
          price: 4.99,
          category: 'drinks_cold',
          popular: true,
          available: true,
          allergens: ['dairy'],
          nutritionalInfo: {
            calories: 120,
            protein: 8,
            carbs: 12,
            fat: 4,
            fiber: 0
          },
          dietaryTags: ['vegetarian', 'gluten-free'],
          spiceLevel: 0,
          image: '/Erbil Yogurt Drink.jpg'
        }
      ],
      categories: [
        { id: 'appetizers', name: { en: 'Appetizers', ar: 'مقبلات', fa: 'پیش‌غذا', ku: 'خۆراکی پێش‌خواردن', tr: 'Başlangıç', ur: 'سٹارٹر', kmr: 'Destpêk', es: 'Aperitivos', ru: 'Закуски', hi: 'स्टार्टर', sq: 'Aperitivë', fr: 'Apéritifs', de: 'Vorspeisen' } },
        { id: 'soup', name: { en: 'Soups', ar: 'شوربات', fa: 'سوپ‌ها', ku: 'شۆربەکان', tr: 'Çorbalar', ur: 'سوپس', kmr: 'Şorbe', es: 'Sopas', ru: 'Супы', hi: 'सूप', sq: 'Supa', fr: 'Soupes', de: 'Suppen' } },
        { id: 'sandwich_platter', name: { en: 'Sandwich & Platter', ar: 'سندويش وصحن', fa: 'ساندویچ و پلاتر', ku: 'ساندویچ و پلێتەر', tr: 'Sandviç ve Tabak', ur: 'سینڈوچ اور پلیٹر', kmr: 'Sandwîç û Plater', es: 'Sándwich y Plato', ru: 'Сэндвич и блюдо', hi: 'सैंडविच और प्लेटर', sq: 'Sandwich dhe Pjatë', fr: 'Sandwich et Plateau', de: 'Sandwich & Platte' } },
        { id: 'pizza', name: { en: 'Pizza', ar: 'بيتزا', fa: 'پیتزا', ku: 'پیتزا', tr: 'Pizza', ur: 'پیزا', kmr: 'Pizza', es: 'Pizza', ru: 'Пицца', hi: 'पिज्जा', sq: 'Pica', fr: 'Pizza', de: 'Pizza' } },
        { id: 'grill', name: { en: 'Grill Platters', ar: 'مشاوي', fa: 'کباب و گریل', ku: 'پلێتەری گرێل', tr: 'Izgara Tabaklar', ur: 'گرل پلیٹرز', kmr: 'Platerên Grill', es: 'Parrilla', ru: 'Гриль', hi: 'ग्रिल प्लेटर', sq: 'Pjatat e Grilit', fr: 'Plats Grillés', de: 'Grillgerichte' } },
        { id: 'specialty', name: { en: 'Specialty', ar: 'أطباق مميزة', fa: 'غذاهای ویژه', ku: 'خۆراکی تایبەتی', tr: 'Özel Yemekler', ur: 'خصوصی ڈشز', kmr: 'Xwarinên Taybet', es: 'Especialidad', ru: 'Фирменные блюда', hi: 'विशेष व्यंजन', sq: 'Specialitetet', fr: 'Spécialités', de: 'Spezialitäten' } },
        { id: 'drinks_cold', name: { en: 'Cold Drinks', ar: 'مشروبات باردة', fa: 'نوشیدنی‌های سرد', ku: 'خواردنەوەی سارد', tr: 'Soğuk İçecekler', ur: 'ٹھنڈے مشروبات', kmr: 'Vexwarinên Sar', es: 'Bebidas Frías', ru: 'Холодные напитки', hi: 'ठंडे पेय', sq: 'Pije të Ftohta', fr: 'Boissons Fraîches', de: 'Kalte Getränke' } },
        { id: 'dessert', name: { en: 'Desserts', ar: 'حلويات', fa: 'دسر', ku: 'شیرینی', tr: 'Tatlı', ur: 'میٹھا', kmr: 'Şîrînî', es: 'Postre', ru: 'Десерты', hi: 'मिठाई', sq: 'Ëmbëlsira', fr: 'Desserts', de: 'Desserts' } }
      ],
      lastUpdated: new Date().toISOString(),
      metadata: {
        totalItems: 12,
        languages: ['en', 'ar', 'fa', 'ku', 'tr', 'ur', 'kmr', 'es', 'ru', 'hi', 'sq', 'fr', 'de'],
        version: '2.0.0'
      }
    }
    
    res.status(200).json(menuData)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}