global.bg = null;

// REALEY V. FAKEY MODEL INFO ==================================================
global.rvfModel = null;
global.rvfDict = ['realey', 'fakey']

// REALEY MODEL INFO ===========================================================
global.rModel = null;
global.rDict = ['romanticism',
                'realism',
                'baroque',
                'renaissance',
                'gothic',
                'neoclassicism',
                'academicism',
                'rococo'];

// RENAISSANCE MODEL INFO ======================================================
global.renModel = null;
global.renDict = ['northern-renaissance',
                  'early-renaissance',
                  'mannerism-late-renaissance',
                  'high-renaissance'];

// FAKEY MODEL INFO ============================================================
global.fModel = null;
global.fDict = ['symbolism',
                'cubism',
                'expressionism',
                'impressionism',
                'fauvism',
                'art-deco',
                'art-nouveau-modern',
                'post-impressionism',
                'surrealism'];

global.treeInfo = {
  rvf: {
    accurate: {
      accu: 0.836,
      size: 22.0
    },
    balanced: {
      accu: 0.809,
      size: 11.8
    },
    fast: {
      accu: 0.811,
      size: 2.02
    }
  },
  f_m: {
    accurate: {
      accu: 0.711,
      size: 22.0
    },
    balanced: {
      accu: 0.715,
      size: 11.8
    },
    fast: {
      accu: 0.651,
      size: 2.02
    }
  },
  f_s: {
    accurate: {
      accu: 0.711,
      size: 22.0
    },
    balanced: {
      accu: 0.698,
      size: 11.8
    },
    fast: {
      accu: 0.649,
      size: 2.02
    }
  },
  r: {
    accurate: {
      accu: 0.784,
      size: 22.0
    },
    balanced: {
      accu: 0.763,
      size: 11.8
    },
    fast: {
      accu: 0.728,
      size: 2.02
    }
  },
  ren:  {
    accurate: {
      accu: 0.831,
      size: 22.0
    },
    balanced: {
      accu: 0.778,
      size: 11.8
    },
    fast: {
      accu: 0.744,
      size: 2.02
    }
  },
}

// PREDICTION INFO =============================================================
global.image = null;
global.prediction = null;

// MOVEMENT MAP ================================================================
global.movementMap = [
  {
    key: 'academicism',
    name: "Academic Classicism",
    dates: "1865 AD - 1920 AD",
    style: "Many paintings by academic artists are simple nature allegories with titles like Dawn, Dusk, Seeing, and Tasting, where these ideas are personified by a single nude figure, composed in such a way as to bring out the essence of the idea. The trend in art was also towards greater idealism, which is contrary to realism, in that the figures depicted were made simpler and more abstract—idealized—in order to be able to represent the ideals they stood in for. This would involve both generalizing forms seen in nature, and subordinating them to the unity and theme of the artwork. Drawings and paintings of the nude, called \"académies\", were the basic building blocks of academic art. Nased on idealistic clichés and representing mythical and legendary motives while contemporary social concerns were being ignored.  Objects depicted looked smooth, slick, and idealized—showing no real texture. Finished and idealized with perfect detail. Platonic forms, or ideals, behind ordinary depictions one would glimpse something abstract, some eternal truth. Beauty is truth, truth beauty. A full and complete idea.",
    commentary: "\"The only was for us to become great and possibly inimitable is to imitate the ancients.\" Only based on idealistic clichés and representing mythical and legendary motives while contemporary social concerns were being ignored.  \"False surface\" of paintings—the objects depicted looked smooth, slick, and idealized—showing no real texture. Too finished and idealized. Sentimental, clichéd, conservative, non-innovative, bourgeois, and \"styleless\". Manufactured false emotion through contrivances and tricks. Old-fashioned with the allegorical nudes and theatrically posed figures seemly bizarre and dreamlike.",
    themes: "History, Technical expertise, Beauty, impressive execution of subject. Platonic forms, or ideals, behind ordinary depictions one would glimpse something abstract, some eternal truth. Beauty is truth, truth beauty. A full and complete idea.",
    start_reason: "Nationalism. Advance cultural standings of nation-states. Increase skill of country artisans. Political control of the arts. ",
    end_reason: "null",
  },
  {
    key:  "mannerism-late-renaissance",
    name: "Mannerism",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1510 AD - 1600 AD",
    style: "Exaggerates proportion, balance, and ideal beauty, often resulting in compositions that are asymmetrical or unnaturally elegant. privileges compositional tension and instability rather than the balance and clarity of earlier Renaissance painting. Exquisite attention to surface and detail: porcelain-skinned figures recline in an even, tempered light, acknowledging the viewer with a cool glance. works exemplifying this trend are often called 'cold' or 'aloof.' This is typical of the so-called \"stylish style\" or Maniera in its maturity. Elongation of figures: often Mannerist work featured the elongation of the human figure – occasionally this contributed to the bizarre imagery of some Mannerist art. Distortion of perspective: in paintings, the distortion of perspective explored the ideals for creating a perfect space. However, the idea of perfection sometimes alluded to the creation of unique imagery. One way in which distortion was explored was through the technique of foreshortening. At times, when extreme distortion was utilized, it would render the image nearly impossible to decipher. Black backgrounds: Mannerist artists often utilized flat black backgrounds to present a full contrast of contours in order to create dramatic scenes. Black backgrounds also contributed to a creating sense of fantasy within the subject matter. Use of darkness and light: many Mannerists were interested in capturing the essence of the night sky through the use of intentional illumination, often creating a sense of fanatical scenes. Notably, special attention was paid to torch and moonlight to create dramatic scenes. Sculptural forms: Mannerism was greatly influenced by sculpture, which gained popularity in the sixteenth century. As a result, Mannerist artists often based their depictions of human bodies in reference to sculptures and prints. This allowed Mannerist artists to focus on creating dimension. Clarity of line: the attention that was paid to clean outlines of figures was prominent within Mannerism and differed largely from the Baroque and High Renaissance.The outlines of figures often allowed for more attention to detail. Composition and space: Mannerist artists rejected the ideals of the Renaissance, notably the technique of one-point perspective. Instead, there was an emphasis on atmospheric effects and distortion of perspective. The use of space in Mannerist works instead privileged crowded compositions with various forms and figures or scant compositions with emphasis on black backgrounds. Mannerist movement: the interest in the study of human movement often lead to Mannerist artists rendering a unique type of movement linked to serpentine positions. These positions often anticipate the movements of future positions because of their often-unstable motions figures. In addition, this technique attributes to the artist's experimentation of form. Painted frames: in some Mannerist works, painted frames were utilized to blend in with the background of paintings and at times, contribute to the overall composition of the artwork. This is at times prevalent when there is special attention paid to ornate detailing. Atmospheric effects: many Mannerists utilized the technique of sfumato, known as, \"the rendering of soft and hazy contours or surfaces\"[33] in their paintings for rendering the streaming of light. Mannerist colour: a unique aspect of Mannerism was in addition to the experimentation of form, composition, and light, much of the same curiosity was applied to color. Many artworks toyed with pure and intense hues of blues, green, pinks, and yellows, which at times detract from the overall design of artworks, and at other times, compliment it. Additionally, when rending skin tone, artists would often concentrate on create overly creaming and light complexions and often utilize undertones of blue. Sculptures used figura serpentinata, often of two intertwined figures, that were interesting from all angles.",
    commentary: "la maniera was a derogatory term for the perceived decline of art after Raphael",
    themes: "Cool, detached.",
    start_reason: "To advance from the Renaissance style. ",
    end_reason: "null",
  },
  {
    key: 'early-renaissance',
    name: "Early Renaissance",
    dates: "1350 AD - 1500 AD",
    style: "Ideal beauty. Realistic use of colors and light. Ethereal, foggy backgrounds. Romantized landscapes. An abundance of sharply outlined characters suddenly appears, robust, clear-cut personalities; lawless nature belonging just as much in the gallery of criminals as in that of great men. Character, individuality, power and energy are the passwords of the Renaissance age.  This new humanity, all these rugged and manly figures which the age had created, had also to appear in painting. In contrast to the former preference for beauty of an angelic and tender type, the problem now was to depict energetic and powerful beings; and to replace shy and feminine, though bearded, men in the pictures of the older masters by angular, harsh determined and daring types. The figures which has formerly hovered like spirits above the earth had now to stand firmly upon their own feet and become part of their earthly home. structure and position of  the figures, as in their expression, a general and uniform type of beauty prevailed. Rudimentary and uncompromising representation of individual qualities. This may  best explain all the strange physiognomies witch suddenly made their appearance in art; course men of the people with uncouth, overworked figures; peasants, with bones of bronze and pointed weather beaten features; half starved old beggars with sagging flesh and tottering bodies; neglected fellows with bald heads, stubbly beards, and long muscular arms. In place of the former dainty pose, every line is now sinew. Their firm, energetic attitude reflects the entire sprit of the rugged age. Expressive possibilities of the human anatomy. Lighting, linear and atmospheric perspective, anatomy, foreshortening and characterisation. The use of proportion – The first major treatment of the painting as a window into space appeared in the work of Giotto di Bondone, at the beginning of the 14th century. True linear perspective was formalized later, by Filippo Brunelleschi and Leon Battista Alberti. In addition to giving a more realistic presentation of art, it moved Renaissance painters into composing more paintings. Foreshortening – The term foreshortening refers to the artistic effect of shortening lines in a drawing so as to create an illusion of depth. Sfumato – The term sfumato was coined by Italian Renaissance artist Leonardo da Vinci and refers to a fine art painting technique of blurring or softening of sharp outlines by subtle and gradual blending of one tone into another through the use of thin glazes to give the illusion of depth or three-dimensionality. This stems from the Italian word sfumare meaning to evaporate or to fade out. The Latin origin is fumare, to smoke. Chiaroscuro – The term chiaroscuro refers to the fine art painting modeling effect of using a strong contrast between light and dark to give the illusion of depth or three-dimensionality. This comes from the Italian words meaning light (chiaro) and dark (scuro), a technique which came into wide use in the Baroque period. Use of: glazing, impasto.",
    commentary: "null",
    themes: "Individualism, humanism, Classics, Classical Orators and philosophers, prominance of the individual. Intellectual and spiritual awakening. Every person's life had value and dignity, Emotional stimulus to piety, uplift the mind to the spiritual, religous conversion, religous education, ritual and cultic practices, the paths of the spiritual realization, to illustrate, supplement and portray in tangible form the principles of Christianity, to conclusively identify biblical, religious scenes, convey religious meaning. Inspire faith. A emotional stimulus to piety, uplift the mind to the spiritual, religous conversion, religous education, ritual and cultic practices, the paths of the spiritual realization, to illustrate, supplement and portray in tangible form the principles of Christianity, to conclusively identify biblical, religious scenes, convey religious meaning. Inspire faith. A moral narrative.",
    start_reason: "Expanded on religious subject matter to more real, human subjects. Discovey of classic liturature, sculpture.",
    end_reason: "null",
  },
  {
    key:  "high-renaissance",
    name: "High Renaissance",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1450 AD - 1530 AD",
    style: "Sumptuous, elaborate, expressive, and exhalted wealthy and powerful people.  Like kings they were depicted in elaborate settings swaddled in furs and silks. Figures had this suppleness and elegance of pose, and to clothed with artistically arranged draperies. Ideal beauty. Realistic use of colors and light. Ethereal, foggy backgrounds. Romantized landscapes. An abundance of sharply outlined characters suddenly appears, robust, clear-cut personalities; lawless nature belonging just as much in the gallery of criminals as in that of great men. Character, individuality, power and energy are the passwords of the Renaissance age.  This new humanity, all these rugged and manly figures which the age had created, had also to appear in painting. In contrast to the former preference for beauty of an angelic and tender type, the problem now was to depict energetic and powerful beings; and to replace shy and feminine, though bearded, men in the pictures of the older masters by angular, harsh determined and daring types. The figures which has formerly hovered like spirits above the earth had now to stand firmly upon their own feet and become part of their earthly home. structure and position of  the figures, as in their expression, a general and uniform type of beauty prevailed. Rudimentary and uncompromising representation of individual qualities. This may  best explain all the strange physiognomies witch suddenly made their appearance in art; course men of the people with uncouth, overworked figures; peasants, with bones of bronze and pointed weather beaten features; half starved old beggars with sagging flesh and tottering bodies; neglected fellows with bald heads, stubbly beards, and long muscular arms. In place of the former dainty pose, every line is now sinew. Their firm, energetic attitude reflects the entire sprit of the rugged age. Expressive possibilities of the human anatomy. Lighting, linear and atmospheric perspective, anatomy, foreshortening and characterisation. The use of proportion – The first major treatment of the painting as a window into space appeared in the work of Giotto di Bondone, at the beginning of the 14th century. True linear perspective was formalized later, by Filippo Brunelleschi and Leon Battista Alberti. In addition to giving a more realistic presentation of art, it moved Renaissance painters into composing more paintings. Foreshortening – The term foreshortening refers to the artistic effect of shortening lines in a drawing so as to create an illusion of depth. Sfumato – The term sfumato was coined by Italian Renaissance artist Leonardo da Vinci and refers to a fine art painting technique of blurring or softening of sharp outlines by subtle and gradual blending of one tone into another through the use of thin glazes to give the illusion of depth or three-dimensionality. This stems from the Italian word sfumare meaning to evaporate or to fade out. The Latin origin is fumare, to smoke. Chiaroscuro – The term chiaroscuro refers to the fine art painting modeling effect of using a strong contrast between light and dark to give the illusion of depth or three-dimensionality. This comes from the Italian words meaning light (chiaro) and dark (scuro), a technique which came into wide use in the Baroque period. Use of: glazing, impasto.",
    commentary: "\"The besotted taste of Gothic monuments, These odious monsters of ignorant centuries, Which the torrents of barbary spewed forth.\",  \"The Italians, having before their eyes the treasures of ancient statuary, were able to acquire the purity and correctness of the drawing quickly. They have learned to give their figures this suppleness and elegance of pose, and to clothe them with artistically arranged draperies. The Germans, on the contrary, had only one model: nature. Also if their poses have some stiffness, so their heads are almost all portraits, they great charm and delicious naiveté in expression. In a way, they are closer to the truth.\" - Albert Durer.",
    themes: "Individualism, humanism, Classics, Classical Orators and philosophers, prominance of the individual. Intellectual and spiritual awakening. Every persons life had value and dignity. Emotional stimulus to piety, uplift the mind to the spiritual, religous conversion, religous education, ritual and cultic practices, the paths of the spiritual realization, to illustrate, supplement and portray in tangible form the principles of Christianity, to conclusively identify biblical, religious scenes, convey religious meaning. Inspire faith. A moral narrative.",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key:  "renaissance",
    name: "Renaissance",
    imagePath: "./assets/images/madonna.jpg",
    dates: "null",
    style: "null",
    commentary: "null",
    themes: "null",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key:  'baroque',
    name: "Baroque",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1600 AD - 1750 AD",
    style: "Intense and warm colours, particularly made use of the primary colours red, blue and yellow, frequently putting all three in close proximity. They avoided the even lighting of Renaissance painting and used strong contrasts of light and darkness on certain parts of the picture to direct attention to the central actions or figures. In their composition, they avoided the tranquil scenes of Renaissance paintings, and chose the moments of the greatest movement and drama. Unlike the tranquil faces of Renaissance paintings, the faces in Baroque paintings clearly expressed their emotions. They often used asymmetry, with action occurring away from the centre of the picture, and created axes that were neither vertical nor horizontal, but slanting to the left or right, giving a sense of instability and movement. They enhanced this impression of movement by having the costumes of the personages blown by the wind, or moved by their own gestures. The overall impressions were movement, emotion and drama. Another essential element of baroque painting was allegory; every painting told a story and had a message, often encrypted in symbols and allegorical characters, which an educated viewer was expected to know and read. Emotional effects of color, overall harmony of the painting. Simplicity, precision, realism, and an emotional stimulus to piety. Religious subject matter. His realistic approach to the human figure, painted directly from life and dramatically spotlit against a dark background,. Elaborate effects to stir up religious passions. A single, powerful effect. Contrast, movement, exuberant detail, deep colour, grandeur and surprise to achieve a sense of awe. excess of ornamentation. Crowded, dense, overlapping, loaded, in order to provoke shock effects. New motifs: artouche, trophies and weapons, baskets of fruit or flowers, and others, made in marquetry, stucco, or carved. Absurdly complex. magic, complexity, confusion, and excess. Stucco materials, twisted columns, 3D figures, frames, angels, domes. Twisted column in the interior of churches is signature Baroque providing a sense of motion, dramatic new way of reflecting light. Cartouches are plaques carved of marble or stone, usually oval and with a rounded surface, which carried images or text in gilded letters, and were placed as interior decoration or above the doorways of buildings, delivering messages to those below. They showed a wide variety of invention, and were found in all types of buildings, from cathedrals and palaces to small chapels. Trompe-l'œil effects. Quadratura, or paintings in trompe-l'oeil, which literally \"fooled the eye\". These were usually painted on the stucco of ceilings or upper walls and balustrades, and gave the impression to those on the ground looking up were that they were seeing the heavens populated with crowds of angels, saints and other heavenly figures, set against painted skies and imaginary architecture. Baroque sculpture was inspired by ancient Roman statuary, particularly by the famous statue of Laocoön. Neo-Baroque objectts: Horns of plenty, festoons, baby angels, female or male mascarons, oval cartouches, acanthus leaves, classical columns, caryatids, pediments.",
    commentary: "\"Bizarre and uselessly complicated.\", \"Borrominini in architecture, Bernini in sculpture, Pietro da Cortona in painting...are a plague on good taste, which infected a large number of artists.\", \"...morally corrupt.\",\"...excessive ornamentation or complexity of line...\"",
    themes: "Religious themes, religious passion, with direct and emotional involvement, Catholicism, Awe, Surprise, Grandeur, emotional stimulus to piety, popularity, emotional stimulus to piety, uplift the mind to the spiritual, religous conversion, religous education, ritual and cultic practices, the paths of the spiritual realization, to illustrate, supplement and portray in tangible form the principles of Christianity, to conclusively identify biblical, religious scenes, convey religious meaning. Inspire faith.",
    start_reason: "Communicated post-1542 Catholic church doctrine. Countered the simplicity and austerity of Protestant architecture. Needed less strict rules but more popular appeal and declared that the arts communicating religious themes with direct and emotional involvement.",
    end_reason: "null",
  },
  {
    key:  "northern-renaissance",
    name: "Northern Renaissance",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1350 AD - 1600 AD",
    style: "Realistic at times to grotesqueness. Little troubled with fine poetic frenzies. Use of: glazing, impasto. Complicated iconography. The detailed realism. Gothic elements, influence. Wood panels. Shapes lose their contours the further away they are, and that the intensity of the colour decreases and assumes a bluish hue. For the landscape views which lent depth to their interiors, they invented aerial and colour perspective. Focus on detailed everyday themes.",
    commentary: "\"The Italians, having before their eyes the treasures of ancient statuary, were able to acquire the purity and correctness of the drawing quickly. They have learned to give their figures this suppleness and elegance of pose, and to clothe them with artistically arranged draperies. The Germans, on the contrary, had only one model: nature. Also if their poses have some stiffness, so their heads are almost all portraits, they great charm and delicious naiveté in expression. In a way, they are closer to the truth.\" - Albert Durer.",
    themes: "Domestic scenes, satire, philosophical, humour, merchants at work, peasants in the fields and play, fantastical landscapes, dogs, cats, birds, children, household goods, nature, anatomy, perspective, architecture, accessories, actual life of the present, the life to come, secular society. Emphasis: devotional piety, spirituality, and living a simple life. Sturdy, honest, coarse, sufficient unto themselves, and caring little for what other people did. Emotional stimulus to piety, uplift the mind to the spiritual, religous conversion, religous education, ritual and cultic practices, the paths of the spiritual realization, to illustrate, supplement and portray in tangible form the principles of Christianity, to conclusively identify biblical, religious scenes, convey religious meaning. Inspire faith. A moral narrative.",
    start_reason: "The political and religious situation of the region. The chaos and upheaval of the church meant that there was no single artistic nucleus. Italian trade, printing. Expanded on religious subject matter to more real, human subjects. Discovey of classic liturature, sculpture. Translation of the Bible. ",
    end_reason: "null",
  },
  {
    key:  "post-impressionism",
    name: "Post Impressionism",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1882 AD - 1915 AD",
    style: "Individuality, pure color, organization and form.  Geometric forms, Paris, arbitrary colour, esoteric, Synthetist style, landscapes, Parisian cafe Culture, 19th-century, Paris, soleil levant,  open composition, impasto, vibrant, effets de soir, natural light, en plein air, boating, leisure activities, Landscapes, modernization, synthetic pigments, industrialization, physics of colour, broader strokes, fleeting impression of colour and light, bright, vibrant, flowers, figures. Vivid colours, thick application of paint, real-life subject matter, geometric forms, distort form for expressive effect, unnatural, arbitrary colour. Reducing objects to their basic shapes while retaining the saturated colours of Impressionism. ",
    commentary: "\"the term 'Post-Impressionism' is not a very precise one, though a very convenient one.\" The schools give recipes, but they do not beget works that make people exclaim: \" How beautiful that is!\"",
    themes: "Asthetic beauty. Individuality, convey feelings, state of mind.",
    start_reason: "Reaction against Impressionists' concern for the naturalistic depiction of light and colour, rejecting triviality of subject matter and the loss of structure.",
    end_reason: "null",
  },
  {
    key:  "neoclassicism",
    name: "Neoclassicism",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1740 AD - 1835 AD",
    style: "Severe and unemotional, Grandeur of ancient Greece and Rome.Rigid. Homoeroticism of Greco-Roman art, erotic male sculptures. Neoclassical art is characterized by its classical form and structure, clarity, and to an degree, realism. More than just a classical revival, Neo-Classicism was directly connected to contemporary political events. Neo-Classical artists at first wanted to supplant the eroticism and frivolity of the Rococo style with a style that was orderly and serious in character.  French Neoclassism painters emphasis's patriotism, as well as a sense of civility and honorableness. The movement was particularly connected with the beliefs of the French Revolution and was seen as anti-aristocratic. The fantasy-based aristocratic art of the Rococo era seemed an insult upon the rights of men and was vilified by critics and the general public.  In an age of sweeping revolution and transformation Neoclassicism became the art of change. Very simple line drawing, figures mostly in profile.",
    commentary: "\"insipid\" and \"almost entirely uninteresting to us\", Rococo frivolity and Baroque movement had been stripped away but many artists struggled to put anything in their place,",
    themes: "Severe, unemotional, rigid, Greek, Roman, Classical Thought. Homoeroticism, erotic males. Neoclassical art is characterized by its classical form and structure, clarity, and to an degree, realism. Connected to contemporary political events. Orderly and serious in character.  Patriotism, civility and honorableness. Revolutionary, anti-aristocratic. Change. Celebrate ideal forms of its beauty. Noble simplicity and calm grandeur. Republican virtues.",
    start_reason: "Reaction to the overbred frivality, eroticism of Rococo style and the emotional charged Baroque style. A general revival of interest in classical thought.Connected to contemporary political events. A style that was orderly and serious in character. The art of revolution and change such as the French Revolution. Popularity of the Grand Tour to Italy.",
    end_reason: "null",
  },
  {
    key:  "rococo",
    name: "Rococo",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1710 AD - 1790 AD",
    style: "Pastel colors; spontaneous brush strokes, dancing lights, subtle surface tonalities and a soft, elegant and charming approach to subject matter. The partial abandonment of symmetry, everything being composed of graceful lines and curves, similar to the Art Nouveau ones. The huge quantity of asymmetrical curves and C-shaped volutes. The very wide use of flowers in ornamentation, an example being festoons made of flowers. Chinese and Japanese motifs. Warm pastel colours (whitish-yellow, cream-coloured, pearl greys, very light blues)",
    commentary: "\"ridiculous jumble of shells, dragons, reeds, palm-trees and plants\", \"out of style and old-fashioned.\" It was used in 1828 for decoration \"which belonged to the style of the 18th century, overloaded with twisting ornaments.\"  Fantasy-based aristocratic art of the Rococo era.  An insult upon the rights of men.",
    themes: "Erotic, Mildly Erotic, Romantic, Frivolous, Aristocratic",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key:  "gothic",
    name: "Gothic",
    imagePath: "./assets/images/madonna.jpg",
    dates: "1150 AD - 1580 AD",
    style: "The earliest Gothic art was monumental sculpture, on the walls of Cathedrals and abbeys. Saints' lives were often depicted. Images of the Virgin Mary changed from the Byzantine iconic form to a more human and affectionate mother, cuddling her infant, swaying from her hip, and showing the refined manners of a well-born aristocratic courtly lady. More focus on Saints.  Gothic ornamental detailing is often introduced before much change is seen in the style of figures or compositions themselves. Then figures become more animated in pose and facial expression, tend to be smaller in relation to the background of scenes, and are arranged more freely in the pictorial space, where there is room. Use of compounds of silver, painted on glass which was then fired, allowed a number of variations of colour, centred on yellows, to be used with clear glass in a single piece. By the end of the period designs increasingly used large pieces of glass which were painted, with yellows as the dominant colours, and relatively few smaller pieces of glass in other colours. Heavy use of gold and goldleaf. The use of spatial indicators such as building elements and natural features such as trees and clouds also denote the French Gothic style of illumination. A new minute realism in oil painting was combined with subtle and complex theological allusions, expressed precisely through the highly detailed settings of religious scenes. Use of polyptychs, multiple panels of painted subjects,  in oil. Donor portraits smaller than the Virgin or saints depicted were used. Heavy use of sculpture. The facades of large churches, especially around doors, continued to have large tympanums, but also rows of sculpted figures spreading around them. Statues show an elegant but exaggerated columnar elongation, some show a more naturalistic style and increasing detachment from the wall behind, and some awareness of the classical tradition. some  figures are almost in the round. Life-size tomb effigies in stone or alabaster became popular for the wealthy, and grand multi-level tombs evolved. Architectural elements are: The rib vault, flying buttress, and pointed (Gothic) arch, Stained-glass window, more windows for light, use of stone, ",
    commentary: "The word \"Gothic\" for art was initially used as a synonym for \"Barbaric\", and was therefore used pejoratively. The new 'barbarian' styles filtering down from north of the Alps posed a similar threat to the classical revival promoted by the early Renaissance. \"monstrous and barbarous\" \"disorder\"- Vasari. \"pointed arches of northern architecture were an echo of the primitive huts\" - Raphael.",
    themes: "Religous piety, Old Testiment, New Testiment, Virgin Mary, Saints. Emotional stimulus to piety, uplift the mind to the spiritual, religous conversion, religous education, ritual and cultic practices, the paths of the spiritual realization, to illustrate, supplement and portray in tangible form the principles of Christianity, to conclusively identify biblical, religious scenes, convey religious meaning. Inspire faith. Moral narrative.",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key: "symbolism",
    name: "Symbolism",
    dates: "1860 AD - 1910 AD",
    style: "More a philosophy than an actual style of art.",
    commentary: "null",
    themes: "Contemplative refuge from the world of strife and will. Mysticism, Otherworldliness, Mortality. A sense of the malign power of sexuality. Rejects the reality of life. ",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key: "cubism",
    name: "Cubism",
    dates: "1905 AD - 1920 AD",
    style: "Objects are analyzed, broken up and reassembled in an abstracted form—instead of depicting objects from a single viewpoint, the artist depicts the subject from a multitude of viewpoints to represent the subject in a greater context. Reducing everything, places and a figures and houses, to geometric schemas, to cubes. Simplification of form and deconstruction of perspective. Partial abstraction. Total Abstraction. Observing a subject from different points in space and time simultaneously, i.e., the act of moving around an object to seize it from several successive angles fused into a single image (multiple viewpoints, mobile perspective, simultaneity or multiplicity), is a generally recognized device used by the Cubists. Strong emphasis on large overlapping geometric planes and flat surface activity. Use of multiple perspective and complex planar faceting for expressive effect while preserving the eloquence of subjects.",
    commentary: "\"What do they mean? Have those responsible for them taken leave of their senses? Is it art or madness? Who knows?\"",
    themes: "Deconstruction, abstraction, expressive and allusive abstraction dedicated to complex emotional and sexual themes.",
    start_reason: "A new way of seeing for the modern age. Revitalise boring traditions (e.g. perspective) of Western art.",
    end_reason: "null",
  },
  {
    key: "expressionism",
    name: "Expressionism",
    dates: "1901 AD - 1950 AD",
    style: "Subjective perspective. Radically distorted for emotional effect to evoke moods or ideas. Expressed meaning of emotional experience rather than physical reality.",
    commentary: "null",
    themes: "Distorted reality for emotional effect to evoke moods or ideas. Expressing the meaning of emotional experience rather than physical reality.",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key: "impressionism",
    name: "Impressionism",
    dates: "1860 AD - 1895 AD",
    style: "Outdoor settings. Characterized by relatively small, thin, yet visible brush strokes, open composition, emphasis on accurate depiction of light in its changing qualities (often accentuating the effects of the passage of time), ordinary subject matter, inclusion of movement as a crucial element of human perception and experience, and unusual visual angles. Violated the rules of academic painting. They constructed their pictures from freely brushed colours that took precedence over lines and contours. Capturing the momentary and transient effects of sunlight by painting outdoors or en plein air. They portrayed overall visual effects instead of details, and used short \"broken\" brush strokes of mixed and pure unmixed colour—not blended smoothly or shaded, as was customary—to achieve an effect of intense colour vibration. Art of immediacy and movement, of candid poses and compositions, of the play of light expressed in a bright and varied use of colour. Recreating the sensation in the eye that views the subject, rather than delineating the details of the subject, and by creating a welter of techniques and forms. Pursuit of an art of spontaneity, sunlight, and colour. Short, thick strokes of paint quickly capture the essence of the subject, rather than its details. The paint is often applied impasto. Colours are applied side by side with as little mixing as possible, a technique that exploits the principle of simultaneous contrast to make the colour appear more vivid to the viewer. Greys and dark tones are produced by mixing complementary colours. Pure impressionism avoids the use of black paint. Wet paint is placed into wet paint without waiting for successive applications to dry, producing softer edges and intermingling of colour. Impressionist paintings do not exploit the transparency of thin paint films (glazes), which earlier artists manipulated carefully to produce effects. The impressionist painting surface is typically opaque. The paint is applied to a white or light-coloured ground. Previously, painters often used dark grey or strongly coloured grounds. The play of natural light is emphasized. Close attention is paid to the reflection of colours from object to object. Painters often worked in the evening to produce effets de soir—the shadowy effects of evening or twilight. In paintings made en plein air (outdoors), shadows are boldly painted with the blue of the sky as it is reflected onto surfaces, giving a sense of freshness previously not represented in painting. (Blue shadows on snow inspired the technique.). further developing into an art form its very subjectivity in the conception of the image, the very subjectivity that photography eliminated\".[31] The Impressionists sought to express their perceptions of nature, rather than create exact representations. This allowed artists to depict subjectively what they saw with their \"tacit imperatives of taste and conscience\".[32] Photography encouraged painters to exploit aspects of the painting medium, like colour, which photography then lacked: \"The Impressionists were the first to consciously offer a subjective alternative to the photograph\". Bold blocks of colour and composition on a strong diagonal slant showing the influence of Japanese prints.",
    commentary: "\"...Wallpaper in its embryonic state is more finished than that seascape.\". Louis Leroy to coined the term in a satirical review published in the Parisian newspaper Le Charivari.",
    themes: "null",
    start_reason: "Rebelled against Acacdemic conforming paintings. Too polished and detailed. Idealistic. Emphasized still-lifes,  landscapes and daily life.",
    end_reason: "null",
  },
  {
    key: "dada",
    name: "Dada",
    dates: "1915 AD - 1950 AD",
    style: "Sculpture, Painting, Prints, Mixed Media, Sound media, Collage, Sound poetry, cut-up writing, visual arts, literature, poetry, art manifestos, art theory, theatre, graphic design, readymades, assemblage, Photomontage, Cut-up",
    commentary: "\"Anti-art.\"; \"Dada philosophy is the sickest, most paralyzing and most destructive thing that has ever originated from the brain of man.\";   If art was to appeal to sensibilities, Dada was intended to offend. \"Dada philosophy is the sickest, most paralyzing and most destructive thing that has ever originated from the brain of man.\" -  American Art News ;  \"reaction to what many of these artists saw as nothing more than an insane spectacle of collective homicide.\"; A savior, a monster, which would lay waste to everything in its path... [It was] a systematic work of destruction and demoralization... In the end it became nothing but an act of sacrilege.\"; Dada is the groundwork to abstract art and sound poetry, a starting point for performance art, a prelude to postmodernism, an influence on pop art, a celebration of antiart to be later embraced for anarcho-political uses in the 1960s and the movement that laid the foundation for Surrealism.",
    themes: "Nonsense, irrationality, anti-bourgeois, protest, peace, anti-war, anti-nationalism, radical far-left thought. Anti art. Anti colonialism. Believed that the 'reason' and 'logic' of bourgeois capitalist society had led people into war. Protest\"against this world of mutual destruction.\". Opposite of everything which art stood for.  Ignored aesthetics. If art was to appeal to sensibilities, Dada was intended to offend. Addressed a postwar economic and moral crisis. Rejected reason and logic, prizing nonsense, irrationality and intuition. Shock, scandel. Art and culture are considered a type of fetishization where the objects of consumption (including organized systems of thought like philosophy and morality) are chosen, much like a preference for cake or cherries, to fill a void. Rejecting \"retinal art\".",
    start_reason: "Rejected the logic, reason, and aestheticism of modern capitalist society. Reaction to violence, destruction of WWI. Anti-Art sentiment. detachment from the constraints of reality. Detachment from reality. Rrejection of the tight correlation between words and meaning. Rejected colonialism.",
    end_reason: "null",
  },
  {
    key: "futurism",
    name: "Futurism",
    dates: "1907 AD - 1944 AD",
    style: "Figurative, Figures in Motion, Speed, movement, glorified science, technology, youth, violence, vehicles, car, airplane, the industrial city,  glorified modernity",
    commentary: "null",
    themes: "null",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key: "fauvism",
    name: "Fauvism",
    dates: "1904 AD - 1908 AD",
    style: "Primitive and less naturalistic. Pure, brilliant colour aggressively applied straight from the paint tubes to create a sense of an explosion. Unnatural color selection. Brown is purple, green is pink. Wild brush work and strident colors, subject simplification and abstraction. Unconstrained brushwork. African and Oceanic art influences. Expressive potency of pure color. Flat, bright colors, eclectic style, mixed techniques. Fauvist style: golden yellows, incandescent blues, thick impasto and larger brushstrokes. Rejection of  traditional three-dimensional space and instead use flat areas or patches of colour to create a new pictorial space.",
    commentary: "\"A pot of paint has been flung in the face of the public.\"  Louis Vauxcelles disparaged the painters as \"fauves\" (wild beasts). An \"orgy of pure tones\". \"A pot of paint has been flung in the face of the public\". Critics were horrified by its flatness, bright colors, eclectic style and mixed technique.",
    themes: "Disturb complacency.",
    start_reason: "Disturb art history complacency.",
    end_reason: "null",
  },
  {
    key: "art-deco",
    name: "Art Deco",
    dates: "1915 AD - 1940 AD",
    style: "Metallic colors, Geometric Designs. From its outset, Art Deco was influenced by the bold geometric forms of Cubism and the Vienna Secession; the bright colors of Fauvism and of the Ballets Russes; the updated craftsmanship of the furniture of the eras of Louis Philippe I and Louis XVI; and the exotic styles of China and Japan, India, Persia, ancient Egypt and Maya art. It featured rare and expensive materials, such as ebony and ivory, and exquisite craftsmanship. The Chrysler Building and other skyscrapers of New York built during the 1920s and 1930s are monuments of the Art Deco style. In the 1930s, during the Great Depression, Art Deco became more subdued. New materials arrived, including chrome plating, stainless steel, and plastic. A sleeker form of the style, called Streamline Moderne, appeared in the 1930s; it featured curving forms and smooth, polished surfaces.[4] Art Deco is one of the first truly international styles, but its dominance ended with the beginning of World War II and the rise of the strictly functional and unadorned styles of modern architecture and the International Style of architecture that followed. Art Deco style, featuring geometric volumes, symmetry, straight lines, concrete covered with marble plaques, finely-sculpted ornament, and lavish interiors, including mosaic friezes. Art Deco was an explosion of colors, featuring bright and often clashing hues, frequently in floral designs, presented in furniture upholstery, carpets, screens, wallpaper and fabrics. Use of ebony and ivory. Luxury and modernity. Combined very expensive materials and exquisite craftsmanship put into modernistic forms. Nothing was cheap about Art Deco: pieces of furniture included ivory and silver inlays, and pieces of Art Deco jewelry combined diamonds with platinum, jade, and other precious materials. Simple geometric shapes like triangles and squares are the basis of all compositional arrangements. ",
    commentary: "...practical objects such as furniture should not have any decoration at all...\"Modern decoration has no decoration\".",
    themes: "Luxury, glamour, exuberance, and faith in social and technological progress. Modernity.",
    start_reason: "Reaction against Art Nouveau. Inspired by Vienna Succession, Cubism, Nabis, Odilon Redon",
    end_reason: "Beginning of WWII. Rise of the strictly functional and unadorned styles of modernism.",
  },
  {
    key: "art-nouveau-modern",
    name: "Art Nouveau",
    dates: "1890 AD - 1920 AD",
    style: "Floral, Vegetal, Plant, Vines, Geometric Stylistic Elements, Flowing",
    commentary: "null",
    themes: "null",
    start_reason: "null",
    end_reason: "null",
  },
  {
    key: 'realism',
    name: "Realism / Naturalism",
    dates: "1850 AD - null AD",
    style: "Generally the attempt to represent subject matter truthfully, without artificiality and avoiding artistic conventions, or implausible, exotic, and supernatural elements. The accurate depiction of lifeforms, perspective, and the details of light and colour. But realist or naturalist works of art may, as well or instead of illusionist realism, be \"realist\" in their subject-matter, and emphasize the mundane, ugly or sordid. Realism is the precise, detailed and accurate representation in art of the visual appearance of scenes and objects. depicted with great skill and care. But subjects could be unreal (e.g. Angels with realistic wings). Realists used unprettified detail depicting the existence of ordinary contemporary life. Realism or naturalism as a style meaning the honest, unidealizing depiction of the subject, can be used in depicting any type of subject, without any commitment to treating the typical or everyday. In the 19th century \"Naturalism\" or the \"Naturalist school\" was somewhat artificially erected as a term representing a breakaway sub-movement of Realism, that attempted (not wholly successfully) to distinguish itself from its parent by its avoidance of politics and social issues, and liked to proclaim a quasi-scientific basis, playing on the sense of \"naturalist\" as a student of Natural history, as the biological sciences were then generally known. ",
    commentary: "null",
    themes: "social or political awareness, mundane, ugly, sordid, social realism, kitchen sink realism.",
    start_reason: "Rejected Romanticism, History Painting",
    end_reason: "null",
  },
  {
    key: 'romanticism',
    name: "Romanticism",
    dates: "1750 AD - 1860 AD",
    style: "Unrefined outlines, unrestrained brushstrokes, and the emphasis on color over form makes the painterly style the choice of the Romantics. Visible brushstrokes, which lend themselves to an energy and immediacy to the painting. Ethereal and foggy Backgrounds. 3D drawing and representation. ",
    commentary: "“Romanticism is precisely situated neither in choice of subject nor in exact truth, but in a way of feeling,”",
    themes: "Individualistic, exotic, beautiful and emotionally wrought. Passion, sensitivity, and imagination. Emotion, individualism, Glorification of all the past, Glorification of nature, medieval rather than the classical.  Intense emotion as an authentic source of aesthetic experience, placing new emphasis on such emotions as apprehension, horror and terror, and awe—especially that experienced in confronting the new aesthetic categories of the sublimity and beauty of nature. Revived medievalism Authentically medieval in an attempt to escape population growth, early urban sprawl, and industrialism.  Achievements of \"heroic\" individualists and artists.  Promoted individual imagination. Realism was offered as a polar opposite to Romanticism. Strong belief and interest in the importance of nature. Effect of nature upon the artist when he is surrounded by it, preferably alone. Distrustful of the human world, close connection with nature was mentally and morally healthy. Uses personal voice of the artist. A new and restless spirit, seeking violently to burst through old and cramping forms. A nervous preoccupation with perpetually changing inner states of consciousness, a longing for the unbounded and the indefinable, for perpetual movement and change, an effort to return to the forgotten sources of life, a passionate effort at self-assertion both individual and collective, a search after means of expressing an unappeasable yearning for unattainable goals\". Horror, passion, and awe, when experienced in the face of nature’s sublime landscape, offered an artistic antidote to the perceived disconnect from spirituality occurring as the theory of evolution took hold around the world. This nostalgia inspired the Romantics to shift the spotlight onto the individual’s imagination and his or her interpretation of the world. Patriotism, nationalism, struggle for independence",
    start_reason: "Reaction against a restrained Classicism and Neoclassicism. Rejections of Industrial Revolution, the aristocratic social and political norms of the Age of Enlightenment, and the scientific rationalization of nature—all components of modernity. Rejection of modernity. Escaping of population growth, early urban sprawl, and industrialism. Rejecting excessive emphasis on the cerebral and instead arguing for heightened emotion.",
    end_reason: "null",
  },
  {
    key: "surrealism",
    name: "Surrealism",
    dates: "1924 AD - ? AD",
    style: "Unnerving, illogical scenes, sometimes with photographic precision, creating strange creatures from everyday objects, and developing painting techniques that allowed the unconscious to express itself. Resolves previously contradictory conditions of dream and reality into an absolute reality, a super-reality\", or surreality. Works of surrealism feature the element of surprise, unexpected juxtapositions and non sequitur; however, many surrealist artists and writers regard their work as an expression of the philosophical movement first and foremost, with the works themselves being an artifact. Leader Breton was explicit in his assertion that Surrealism was, above all, a revolutionary movement. At the time, the movement was associated with political causes such as communism and anarchism.",
    commentary: "null",
    themes: "Unnerving, illogical, strange unconscious expression, Dream, Unreality, Sureality. Disorienting, hallucinatory quality of a dream; fantastic. Surprise, Unexpected Juxtapositions, non sequiturs. Revolutionary.",
    start_reason: "null",
    end_reason: "null",
  },
];

// BUTTON COLORS ===============================================================
global.colors = ({
  dark1: '#202042',
  dark2: '#080816',
  med1:  '#323264',
  med2:  '#161632',
  lite1: '#484880',
  lite2: '#282852',
});
