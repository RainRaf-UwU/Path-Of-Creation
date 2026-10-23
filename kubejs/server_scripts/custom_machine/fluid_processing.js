ServerEvents.recipes(e =>{
    const structure_f = [
  [
    [
      "     a   ",
      "  aaaaa  ",
      " aaaaaaa ",
      "aaaaaaaa ",
      " aaaaaaa ",
      " aaaaaaaa",
      " aaaaaaa ",
      "  aaaaa  ",
      "   a     ",
      "         "
    ],
    [
      "         ",
      "         ",
      "    f    ",
      "   fff   ",
      "   ffff  ",
      "   fff   ",
      "         ",
      "         ",
      "   bh    ",
      "    m    "
    ],
    [
      "         ",
      "   ddd   ",
      "  ddedd  ",
      " dde edd ",
      "  e   ed ",
      "  ee eed ",
      "   eee   ",
      "         ",
      "    k    ",
      "         "
    ],
    [
      "         ",
      "   ggg   ",
      "  ggegg  ",
      " gge egg ",
      "       g ",
      "       g ",
      "         ",
      "         ",
      "         ",
      "         "
    ],
    [
      "         ",
      "   iii   ",
      "  ii ii  ",
      " ii   ii ",
      "       i ",
      "       i ",
      "         ",
      "         ",
      "         ",
      "         "
    ],
    [
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         "
    ],
    [
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         "
    ],
    [
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         ",
      "         "
    ],
    [
      "         ",
      "         ",
      "         ",
      "    c    ",
      "   ccc   ",
      "    c    ",
      "         ",
      "         ",
      "         ",
      "         "
    ],
    [
      "         ",
      "         ",
      "         ",
      "    j    ",
      "   jjj   ",
      "    j    ",
      "         ",
      "         ",
      "         ",
      "         "
    ]
  ],
  [
    [
      "                     ",
      "                     ",
      "       aaa aaa       ",
      "      aaaaaaaaa      ",
      "     aaaaaaaaaaa     ",
      "    aaaaaaaaaaaaa    ",
      "   aaaaaaaaaaaaaaa   ",
      "  aaaaaaaaaaaaaaaaa  ",
      "  aaaaaaaaaaaaaaaaa  ",
      "  aaaaaaaaaaaaaaaaa  ",
      "   aaaaaaa aaaaaaa   ",
      "  aaaaaaaaaaaaaaaaa  ",
      "  aaaaaaaaaaaaaaaaa  ",
      "  aaaaaaaaaaaaaaaaa  ",
      "   aaaaaaaaaaaaaaa   ",
      "    aaaaaaaaaaaaa    ",
      "     aaaaaaaaaaa     ",
      "      aaaaaaaaa      ",
      "       aaa aaa       ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     cc       cc     ",
      "  hhhc eeeeeee chhh  ",
      "  hhh ee     ee hhh  ",
      "  hhhee ggggg eehhh  ",
      " cc ee g     g ee cc ",
      "cc ee g  tt   g ee cc",
      "c ee g  ttttt  g ee c",
      "c e g  ttttttt  g e c",
      "c e g tttttttt  g e c",
      "c e g  ttttttt  g e c",
      "c e g  ttttttt  g e c",
      "c e g  ttttttt  g e c",
      "c ee g  ttttt  g ee c",
      "cc ee g       g ee cc",
      " cc ee g     g ee cc ",
      "  hhhee ggggg eehhh  ",
      "  hhh ee     ee hhh  ",
      "  hhhc eeeeeee chhh  ",
      "     cc       cc     ",
      "      ccccccccc      ",
      "          F          ",
      "          m          "
    ],
    [
      "      ccccccccc      ",
      "     ccbbbbbbbcc     ",
      "  hhhcbeeeeeeebchhh  ",
      "  hhhbee     eebhhh  ",
      "  hhhee       eehhh  ",
      " ccbee  ffiii  eebcc ",
      "ccbee  ffkkkii  eebcc",
      "cbee  ffknnnkii  eebc",
      "cbe  ffknn nnkii  ebc",
      "cbe  fknn   nnki  ebc",
      "cbe  kno     nki  ebc",
      "cbe  knoo   nnki  ebc",
      "cbe  jjnoo nnkii  ebc",
      "cbee  jinnnnnii  eebc",
      "ccbee  iinnnii  eebcc",
      " ccbee  iiiii  eebcc ",
      "  hhhee       eehhh  ",
      "  hhhbee     eebhhh  ",
      "  hhhcbeeeeeeebchhh  ",
      "     ccbbbbbbbcc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     ccuuuuuuucc     ",
      "  hhhcueeeeeeeuchhh  ",
      "  hhhuee     eeuhhh  ",
      "  hhhee       eehhh  ",
      " ccuee  ooooo  eeucc ",
      "ccuee  oosvvoo  eeucc",
      "cuee  oosxxxvoo  eeuc",
      "cue  oosxx xxvoo  euc",
      "cue  osww   xxvo  euc",
      "cu   swy     xvo  euc",
      "cu   swyy   xxvo  euc",
      "cu   ssvyy xxvoo  euc",
      "cu    qqvyyyvoo  eeuc",
      "ccu    qpvvvpp  eeucc",
      " ccu    ppppp  eeucc ",
      "  hhh         eehhh  ",
      "  hhhu       eeuhhh  ",
      "  hhhcu eeeeeeuchhh  ",
      "     ccuuuuuuucc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     ccbbbbbbbcc     ",
      "  hhhcb       bchhh  ",
      "  hhhb         bhhh  ",
      "  hhh           hhh  ",
      " ccb    yyAAA    bcc ",
      "ccb    yyEEEAB    bcc",
      "cb    yyEHHIECD    bc",
      "cb   yyEHH IIEDD   bc",
      "cb   yEHH   IIGD   bc",
      "cb   EHM     IGD   bc",
      "cb   EHLL   IIGD   bc",
      "cb   EEHKJ IIGDD   bc",
      "cb    EEHIIIGDD    bc",
      "ccb    EEHHGED    bcc",
      " ccb    EEEEE    bcc ",
      "  hhh           hhh  ",
      "  hhhb         bhhh  ",
      "  hhhcb       bchhh  ",
      "     ccbbbbbbbcc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     ccuuuuuuucc     ",
      "  hhhcu       uchhh  ",
      "  hhhu lllllll uhhh  ",
      "  hhh ll     ll hhh  ",
      " ccu ll OOPPP ll ucc ",
      "ccu ll OOYY PP ll ucc",
      "cu ll OOX    PQ ll uc",
      "cu l NNW      RR l uc",
      "cu l NV        R l uc",
      "cu l V         R l uc",
      "cu l V         R l uc",
      "cu l VV       RR l uc",
      "cu ll VV     RR ll uc",
      "ccu ll VV   RR ll ucc",
      " ccu ll UUTTS ll ucc ",
      "  hhh ll     ll hhh  ",
      "  hhhu lllllll uhhh  ",
      "  hhhcu       uchhh  ",
      "     ccuuuuuuucc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     ccbbbbbbbcc     ",
      "  hhhcbdddddddbchhh  ",
      "  hhhbdd     ddbhhh  ",
      "  hhhdd       ddhhh  ",
      " ccbdd         ddbcc ",
      "ccbdd           ddbcc",
      "cbdd             ddbc",
      "cbd               dbc",
      "cbd               dbc",
      "cbd               dbc",
      "cbd               dbc",
      "cbd               dbc",
      "cbdd             ddbc",
      "ccbdd           ddbcc",
      " ccbdd         ddbcc ",
      "  hhhdd       ddhhh  ",
      "  hhhbdd     ddbhhh  ",
      "  hhhcbdddddddbchhh  ",
      "     ccbbbbbbbcc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     ccuuuuuuucc     ",
      "  hhhcuddddddduchhh  ",
      "  hhhudd     dduhhh  ",
      "  hhhdd rrrrr ddhhh  ",
      " ccudd r     r   ucc ",
      "ccudd r       r   ucc",
      "cudd r         r   uc",
      "cud r           r  uc",
      "cud r           r  uc",
      "cu  r           r  uc",
      "cu  r           r  uc",
      "cu  r           r  uc",
      "cu   r         r   uc",
      "ccu   r       r   ucc",
      " ccu   r     r   ucc ",
      "  hhh   rrrrr   hhh  ",
      "  hhhu         uhhh  ",
      "  hhhcu       uchhh  ",
      "     ccuuuuuuucc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     ccbbbbbbbcc     ",
      "  hhhcb       bchhh  ",
      "  hhhb         bhhh  ",
      "  hhh           hhh  ",
      " ccb             bcc ",
      "ccb               bcc",
      "cb                 bc",
      "cb                 bc",
      "cb                 bc",
      "cb                 bc",
      "cb                 bc",
      "cb                 bc",
      "cb                 bc",
      "ccb               bcc",
      " ccb             bcc ",
      "  hhh           hhh  ",
      "  hhhb         bhhh  ",
      "  hhhcb       bchhh  ",
      "     ccbbbbbbbcc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      ccccccccc      ",
      "     ccuuuuuuucc     ",
      "  hhhcu       uchhh  ",
      "  hhhu         uhhh  ",
      "  hhh           hhh  ",
      " ccu             ucc ",
      "ccu               ucc",
      "cu                 uc",
      "cu                 uc",
      "cu                 uc",
      "cu                 uc",
      "cu                 uc",
      "cu                 uc",
      "cu                 uc",
      "ccu               ucc",
      " ccu             ucc ",
      "  hhh           hhh  ",
      "  hhhu         uhhh  ",
      "  hhhcu       uchhh  ",
      "     ccuuuuuuucc     ",
      "      ccccccccc      ",
      "                     ",
      "                     "
    ],
    [
      "      cccccccc       ",
      "     ccbbbbbbb       ",
      "  hhhcb       b hhh  ",
      "  hhhb         bhhh  ",
      "  hhh           hhh  ",
      " ccb ll          b   ",
      "ccb ll            b  ",
      "cb ll              b ",
      "cb l               b ",
      "cb l               b ",
      "                   b ",
      "                   b ",
      "                   b ",
      "                     ",
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      " u                   ",
      " u                   ",
      " u                   ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh   rrrrr   hhh  ",
      "       r             ",
      "      r              ",
      "     r               ",
      "    r                ",
      "    r                ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "  hhh           hhh  ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "                     ",
      "                     ",
      "  hhh           hhh  ",
      "  hhh           hh   ",
      "  hhh                ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "  hhh                ",
      "  hhh                ",
      "  hhh                ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ],
    [
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "        ggggg        ",
      "       g     g       ",
      "      g       g      ",
      "     g         g     ",
      "    g           g    ",
      "    g           g    ",
      "                g    ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "                     "
    ]
  ],
  [
    [
      "        aa     ",
      "    aaaaaaa    ",
      "   aaaaaaaaa   ",
      "  aaaaaaaaaaa  ",
      " aaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaa ",
      " aaaaaa aaaaaa ",
      " aaaaaaaaaaaaaa",
      " aaaaaaaaaaaaaa",
      " aaaaaaaaaaaaa ",
      "  aaaaaaaaaaa  ",
      "   aaaaaaaaa   ",
      "    aaaaaaa    ",
      "     aa        ",
      "               ",
      "               ",
      "               "
    ],
    [
      "    jjjjjjj    ",
      "   jj     jj   ",
      "  jj bbbbb jj  ",
      " jj bb   bb jj ",
      "jj beeeeeeeb jj",
      "j bbeeeeeeebb j",
      "j b eeeeeee   j",
      "j   eeeeeee   j",
      "j   eeeeeee   j",
      "j   eeeeeee   j",
      "jj  eeeeeee  jj",
      " jj         jj ",
      "  jj       jj  ",
      "   jj     jj   ",
      "    jjjjjjj    ",
      "               ",
      "       g       ",
      "       m       "
    ],
    [
      "    jjjj       ",
      "   jjccccc     ",
      "  jjc     c    ",
      " jjc       c   ",
      "jjc eeeeeee c  ",
      "jc  eeeeeee  c ",
      "jc  eeeeeee  c ",
      " c  eeeeeee  c ",
      " c  eeeeeee  c ",
      " c  eeeeeee  c ",
      "  c eeeeeee c  ",
      "   c       c   ",
      "    c     c    ",
      "     ccccc     ",
      "               ",
      "               ",
      "       h       ",
      "               "
    ],
    [
      "               ",
      "     ddddd     ",
      "    d     d    ",
      "   d       d   ",
      "  d         d  ",
      " d    ee     d ",
      " d   eeee    d ",
      " d   eeeee   d ",
      " d    eee    d ",
      " d     e     d ",
      "  d         d  ",
      "   d       d   ",
      "    d     d    ",
      "     ddddd     ",
      "               ",
      "               ",
      "               ",
      "               "
    ],
    [
      "               ",
      "     ccccc     ",
      "    c     c    ",
      "   c       c   ",
      "  c         c  ",
      " c           c ",
      " c           c ",
      " c           c ",
      " c           c ",
      " c           c ",
      "  c         c  ",
      "   c       c   ",
      "    c     c    ",
      "     ccccc     ",
      "               ",
      "               ",
      "               ",
      "               "
    ],
    [
      "               ",
      "     ddddd     ",
      "    d     d    ",
      "   d  iii  d   ",
      "  d  i   i  d  ",
      " d  i     i  d ",
      " d i       i d ",
      " d i       i d ",
      " d i       i d ",
      " d  i     i  d ",
      "  d  i   i  d  ",
      "   d  iii  d   ",
      "    d     d    ",
      "     ddddd     ",
      "               ",
      "               ",
      "               ",
      "               "
    ],
    [
      "               ",
      "     ccccc     ",
      "    c     c    ",
      "   c  iii  c   ",
      "  c  i   i  c  ",
      " c  i     i  c ",
      " c i       i c ",
      " c i       i c ",
      " c i       i c ",
      " c  i     i  c ",
      "  c  i   i  c  ",
      "   c  iii  c   ",
      "    c     c    ",
      "     ccccc     ",
      "               ",
      "               ",
      "               ",
      "               "
    ],
    [
      "               ",
      "     ddddd     ",
      "    d     d    ",
      "   d       d   ",
      "  d         d  ",
      " d           d ",
      " d           d ",
      " d           d ",
      " d           d ",
      " d           d ",
      "  d         d  ",
      "   d       d   ",
      "    d     d    ",
      "     ddddd     ",
      "               ",
      "               ",
      "               ",
      "               "
    ],
    [
      "               ",
      "     ccc       ",
      "    c          ",
      "   c           ",
      "  c            ",
      " c             ",
      " c             ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               "
    ],
    [
      "               ",
      "     ddddd     ",
      "    d     d    ",
      "   d       d   ",
      "  d         d  ",
      " d           d ",
      " d           d ",
      "             d ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               "
    ],
    [
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "      ff       ",
      "      fff      ",
      "       f       ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               ",
      "               "
    ]
  ],
  [
    [
      "ama"
    ],
    [
      "a a"
    ],
    [
      "a a"
    ]
  ],
  [
    [
      "                 aaaaaa          ",
      "         aaaaaaaaaaaaaaa         ",
      "        aaaaaaaaaaaaaaaaa        ",
      "       aaaaaaaaaaaaaaaaaaa       ",
      "      aaaaaaaaaaaaaaaaaaaaa      ",
      "     aaaaaaaaaaaaaaaaaaaaaaa     ",
      "    aaaaaaaaaaaaaaaaaaaaaaaaa    ",
      "   aaaaaaaaaaaaaaaaaaaaaaaaaaa   ",
      "  aaaaaaaaaaaaaaaaaaaaaaaaaaaaa  ",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
      "  aaaaaaaaaaaaaaaaaaaaaaaaaaaaa  ",
      "   aaaaaaaaaaaaaaaaaaaaaaaaaaa   ",
      "    aaaaaaaaaaaaaaaaaaaaaaaaa    ",
      "     aaaaaaaaaaaaaaaaaaaaaaa     ",
      "      aaaaaaaaaaaaaaaaaaaaa      ",
      "       aaaaaaaaaaaaaaaaaaa       ",
      "        aaaaaaaaaaaaaaaaa        ",
      "         aaaaaaaaaaaaaaa         ",
      "          aaaaaa                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbbiiiiiiiiiiibbb        ",
      "    f  bbbii         iibbb  f    ",
      "      bbbii           iibbb      ",
      "     bcccccccccccccccccccccb     ",
      "    bbcccccccccccccccccccccbb    ",
      "   bbbcccccccccccccccccccccbbb   ",
      "  bbbicccccccccccccccccccccibbb  ",
      " bbbiiccccccccccccccccccccciibbb ",
      " bbii cccccccclcccccccccccc iibb ",
      " bbi  ccccccclllllllccccccc  ibb ",
      " bbi  cccccclllllllllcccccc  ibb ",
      " bbi  cccccllllllllllcccccc  ibb ",
      " bbi  cccccllllllllllcccccc  ibb ",
      " bbi  cccccclllllllllcccccc  ibb ",
      " bbi  cccccclllllllllcccccc  ibb ",
      " bbi  cccccclllllllllcccccc  ibb ",
      " bbi  cccccclllllllllcccccc  ibb ",
      " bbi  ccccccclllllllccccccc  ibb ",
      " bbii ccccccccccccccccccccc iibb ",
      " bbbiiccccccccccccccccccccciibbb ",
      "  bbbicccccccccccccccccccccibbb  ",
      "   bbbcccccccccccccccccccccbbb   ",
      "    bbcccccccccccccccccccccbb    ",
      "     bcccccccccccccccccccccb     ",
      "      bbbii           iibbb      ",
      "    f  bbbii         iibbb  f    ",
      "        bbbiiiiiiiiiiibbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                d                ",
      "                m                "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbbiiiiiiiiiiibbb        ",
      "    f  bbbii         iibbb  f    ",
      "      bbbii           iibbb      ",
      "     bbbii             iibbb     ",
      "    bbbii               iibbb    ",
      "   bbbii    ccccccccc    iibbb   ",
      "  bbbii    ccccccccccc    iibbb  ",
      " bbbii    ccccccccccccc    iibbb ",
      " bbii    ccccccccccccccc    iibb ",
      " bbi    cccccnnnnnnnccccc    ibb ",
      " bbi    ccccnnnnnnnnncccc    ibb ",
      " bbi    ccccnnnnnnnnncccc    ibb ",
      " bbi    ccccnnnnnnnnncccc    ibb ",
      " bbi    ccccnnnnnnnnncccc    ibb ",
      " bbi    ccccnnnnnnnnncccc    ibb ",
      " bbi    ccccnnnnnnnnncccc    ibb ",
      " bbi    ccccnnnnnnnnncccc    ibb ",
      " bbi     ccccnnnnnnnccccc    ibb ",
      " bbii     cccccccccccccc    iibb ",
      " bbbii     cccccccccccc    iibbb ",
      "  bbbii     cccccccccc    iibbb  ",
      "   bbbii     cccccccc    iibbb   ",
      "    bbbii               iibbb    ",
      "     bbbii             iibbb     ",
      "      bbbii           iibbb      ",
      "    f  bbbii         iibbb  f    ",
      "        bbbiiiiiiiiiiibbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbbiiiiiiiiiiibbb        ",
      "    f  bbbii         iibbb  f    ",
      "      bbbii           iibbb      ",
      "     beeeeeeeeeeeeeeeeeeeeeb     ",
      "    bbeeeeeeeeeeeeeeeeeeeeebb    ",
      "   bbbeeeeeeeeeeeeeeeeeeeeebbb   ",
      "  bbbieeeeeeeeeeeeeeeeeeeeeibbb  ",
      " bbbiieeeeeeeeeeeeeeeeeeeeeiibbb ",
      " bbii eeeeeeeeeeeeeeeeeeeee iibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbi  eeeeeeeeeeeeeeeeeeeee  ibb ",
      " bbii eeeeeeeeeeeeeeeeeeeee iibb ",
      " bbbiieeeeeeeeeeeeeeeeeeeeeiibbb ",
      "  bbbieeeeeeeeeeeeeeeeeeeeeibbb  ",
      "   bbbeeeeeeeeeeeeeeeeeeeeebbb   ",
      "    bbeeeeeeeeeeeeeeeeeeeeebb    ",
      "     beeeeeeeeeeeeeeeeeeeeeb     ",
      "      bbbii           iibbb      ",
      "    f  bbbii         iibbb  f    ",
      "        bbbiiiiiiiiiiibbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbbiiiiiiiiiiibbb        ",
      "    f  bbbii         iibbb  f    ",
      "      bbbii           iibbb      ",
      "     bbbii             iibbb     ",
      "    bbbii               iibbb    ",
      "   bbbii                 iibbb   ",
      "  bbbii                   iibbb  ",
      " bbbii                     iibbb ",
      " bbii         eeeee         iibb ",
      " bbi         eeeeeee         ibb ",
      " bbi        eeeeeeeee        ibb ",
      " bbi       eeeeeeeeeee       ibb ",
      " bbi       eeeeeeeeeee       ibb ",
      " bbi        eeeeeeeeee       ibb ",
      " bbi        eeeeeeeeee       ibb ",
      " bbi        eeeeeeeee        ibb ",
      " bbi        eeeeeeeee        ibb ",
      " bbi         eeeeeee         ibb ",
      " bbii                       iibb ",
      " bbbii                     iibbb ",
      "  bbbii                   iibbb  ",
      "   bbbii                 iibbb   ",
      "    bbbii               iibbb    ",
      "     bbbii             iibbb     ",
      "      bbbii           iibbb      ",
      "    f  bbbii         iibbb  f    ",
      "        bbbiiiiiiiiiiibbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbbiiiiiiiiiiibbb        ",
      "    f  bbbii         iibbb  f    ",
      "      bbbii           iibbb      ",
      "     bbbii             iibbb     ",
      "    bbbii               iibbb    ",
      "   bbbii                 iibbb   ",
      "  bbbii                     bbb  ",
      " bbbii                       bbb ",
      " bbii                         bb ",
      " bbi                          bb ",
      " bbi                          bb ",
      " bbi                          bb ",
      " bbi                          bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bbb                         bbb ",
      "  bbb                       bbb  ",
      "   bbb                     bbb   ",
      "    bbb                   bbb    ",
      "     bbb                 bbb     ",
      "      bbb               bbb      ",
      "    f  bbb             bbb  f    ",
      "        bbb           bbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbb           bbb        ",
      "    f  bbb             bbb  f    ",
      "      bbb   jjjjjjjjj   bbb      ",
      "     bbb   j         j   bbb     ",
      "    bbb   j           j   bbb    ",
      "   bbb   j             j   bbb   ",
      "  bbb   j               j   bbb  ",
      " bbb   j                 j   bbb ",
      " bb   j                   j   bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb  j                     j  bb ",
      " bb   j                   j   bb ",
      " bbb   j                 j   bbb ",
      "  bbb   j               j   bbb  ",
      "   bbb   j             j   bbb   ",
      "    bbb   j           j   bbb    ",
      "     bbb   j         j   bbb     ",
      "      bbb   jjjjjjjjj   bbb      ",
      "    f  bbb             bbb  f    ",
      "        bbb           bbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbb           bbb        ",
      "    f  bbb ggggggggggg bbb  f    ",
      "      bbb gg         gg bbb      ",
      "     bbb gg           gg bbb     ",
      "    bbb gg             gg bbb    ",
      "   bbb gg               g  bbb   ",
      "  bbb gg                    bbb  ",
      " bbb gg                      bbb ",
      " bb gg                        bb ",
      " bb g                         bb ",
      " bb g                         bb ",
      " bb g                         bb ",
      " bb g                         bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bbb                         bbb ",
      "  bbb                       bbb  ",
      "   bbb                     bbb   ",
      "    bbb                   bbb    ",
      "     bbb                 bbb     ",
      "      bbb               bbb      ",
      "    f  bbb             bbb  f    ",
      "        bbb           bbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbb           bbb        ",
      "    f  bbb             bbb  f    ",
      "      bbb               bbb      ",
      "     bbb    ooooooooo    bbb     ",
      "    bbb    oo       oo    bbb    ",
      "   bbb    oo         oo    bbb   ",
      "  bbb    oo           oo    bbb  ",
      " bbb    oo             oo    bbb ",
      " bb    oo               oo    bb ",
      " bb   oo                 oo   bb ",
      " bb   o                   o   bb ",
      " bb   o                   o   bb ",
      " bb   o                   o   bb ",
      " bb   o                   o   bb ",
      " bb   o                   o   bb ",
      " bb   o                   o   bb ",
      " bb   o                   o   bb ",
      " bb   oo                 oo   bb ",
      " bb    oo               oo    bb ",
      " bbb    oo             oo    bbb ",
      "  bbb    oo           oo    bbb  ",
      "   bbb    oo         oo    bbb   ",
      "    bbb    oo       oo    bbb    ",
      "     bbb    ooooooooo    bbb     ",
      "      bbb               bbb      ",
      "    f  bbb             bbb  f    ",
      "        bbb           bbb        ",
      "         bbbbbbbbbbbbbbb         ",
      "          bbbbbbbbbbbbb          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "          bbbbbbbbbbbbb          ",
      "         bbbbbbbbbbbbbbb         ",
      "        bbb           bbb        ",
      "    f  bbb             bbb  f    ",
      "      bbb               bbb      ",
      "     bbb                 bbb     ",
      "    bbb                   bbb    ",
      "   bbb                     bbb   ",
      "  bbb                       bbb  ",
      " bbb                         bbb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      " bb                           bb ",
      "                              bb ",
      "                              bb ",
      "                              bb ",
      "                              bb ",
      "                              bb ",
      "                              bb ",
      "                             bbb ",
      "                            bbb  ",
      "                           bbb   ",
      "                          bbb    ",
      "                         bbb     ",
      "                        bbb      ",
      "    f                  bbb  f    ",
      "                      bbb        ",
      "                     bbb         ",
      "                      b          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                       f    ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                       f    ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                       f    ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                       f    ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                       f    ",
      "            jjjjjjjjj            ",
      "           j         j           ",
      "          j           j          ",
      "         j             j         ",
      "        j               j        ",
      "       j                 j       ",
      "      j                   j      ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "      j                   j      ",
      "       j                 j       ",
      "        j               j        ",
      "         j             j         ",
      "          j           j          ",
      "           j         j           ",
      "            jjjjjjjjj            ",
      "    f                       f    ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                       f    ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                       f    ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                            ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "    f                            ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "              hhhhh              ",
      "             hhhhhhh             ",
      "            hhhhhhhhh            ",
      "           hhhhhhhhhhh           ",
      "          hhhhhhhhhhhhh          ",
      "          hhhhhhhhhhhhh          ",
      "           hhhhhhhhhhhh          ",
      "           hhhhhhhhhhhh          ",
      "           hhhhhhhhhhhh          ",
      "           hhhhhhhhhhh           ",
      "            hhhhhhhhh            ",
      "             hhhhhhh             ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ],
    [
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "            jjjjjjjjj            ",
      "           j         j           ",
      "          j           j          ",
      "         j             j         ",
      "        j               j        ",
      "       j                 j       ",
      "      j                   j      ",
      "     j                     j     ",
      "     j                     j     ",
      "     j                     j     ",
      "     j         kk          j     ",
      "               kkk         j     ",
      "                k          j     ",
      "                           j     ",
      "                           j     ",
      "                           j     ",
      "                          j      ",
      "                         j       ",
      "                        j        ",
      "                       j         ",
      "                      j          ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 ",
      "                                 "
    ]
  ]
]


const structure_f_key = [
     {"a":"alltheores:steel_block",
"b":"minecraft:chest",
"c":"allthemodium:allthemodium_block",
"d":"alltheores:iridium_block",
"e":"ae2:quartz_vibrant_glass",
"f":"minecraft:brewing_stand",
"g":"alltheores:zinc_block",
"h":"minecraft:redstone_block",
"i":"immersiveengineering:storage_aluminum",
"j":"allthemodium:vibranium_block",
"k":"stellaris:desh_block"},

 {"a":"alltheores:steel_block",
"b":"actuallyadditions:empowered_diamatine_crystal_block",
"c":"advanced_ae:quantum_alloy_block",
"d":"ae2:quartz_vibrant_glass",
"e":"mekanism:steel_casing",
"f":"ae2:energy_acceptor",
"g":"ae2:quartz_bricks",
"h":"actuallyadditions:empowered_enori_crystal_block",
"i":"enderio:pulsating_alloy_block",
"j":"allthemodium:unobtainium_vibranium_alloy_block",
"k":"minecraft:slime_block",
"l":"draconicevolution:energy_pylon",
"n":"enderio:vibrant_alloy_block",
"o":"allthemodium:unobtainium_block",
"p":"oritech:framed_superconductor_connection",
"q":"allthemodium:vibranium_allthemodium_alloy_block",
"r":"extendedae:assembler_matrix_glass",
"s":"oritech:framed_superconductor",
"t":"mekanism:ultimate_induction_cell",
"u":"enderio:conductive_alloy_block",
"v":"minecraft:target",
"w":"oritech:framed_superconductor",
"x":"naturesaura:oak_generator",
"y":"mekanismgenerators:electromagnetic_coil",
"A":"glassential:glass_glowstone_lamp",
"B":"oritech:framed_superconductor",
"C":"oritech:framed_superconductor_connection",
"D":"minecraft:observer",
"E":"naturesaura:animal_generator",
"F":"minecraft:redstone_block",
"G":"oritech:framed_superconductor",
"H":"oritech:framed_superconductor",
"I":"oritech:framed_superconductor",
"J":"oritech:framed_superconductor",
"K":"oritech:framed_superconductor",
"L":"oritech:framed_superconductor",
"M":"oritech:framed_superconductor",
"N":"oritech:framed_superconductor",
"O":"oritech:framed_superconductor",
"P":"oritech:framed_superconductor",
"Q":"oritech:framed_superconductor",
"R":"minecraft:observer",
"S":"oritech:framed_superconductor",
"T":"oritech:framed_superconductor",
"U":"oritech:framed_superconductor",
"V":"oritech:framed_superconductor",
"W":"oritech:framed_superconductor_connection",
"X":"oritech:framed_superconductor",
"Y":"oritech:framed_superconductor"},

{"a":"alltheores:steel_block",
"b":"allthemodium:unobtainium_block",
"c":"actuallyadditions:empowered_void_crystal_block",
"d":"ae2:quartz_vibrant_glass",
"e":"minecraft:hay_block[axis=y]",
"f":"extendedcrafting:nether_star_block",
"g":"minecraft:redstone_block",
"h":"oritech:machine_core_7",
"i":"actuallyadditions:atomic_reconstructor",
"j":"minecraft:obsidian"},

{"a":"justdirethings:time_crystal_block"},

{"a":"alltheores:steel_block",
"b":"enderio:void_chassis",
"c":"minecraft:blue_ice",
"d":"minecraft:redstone_block",
"e":"hostilenetworks:sim_chamber",
"f":"enderio:clear_glass_e",
"g":"rain:solid_dim_core",
"h":"mekanism:block_refined_obsidian",
"i":"glassential:glass_ethereal",
"j":"extendedcrafting:nether_star_block",
"k":"hostilenetworks:loot_fabricator",
"l":"minecraft:netherrack",
"n":"minecraft:fire",
"o":"mekanismgenerators:saturating_condenser"}
]

   let list_1 = [
    ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:mundane"}]'],
    ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:thick"}]'],
    ['minecraft:nether_wart','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]'],

   ]


   list_1.forEach(([in_i,ou_f]) => {
     e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem(in_i)
    .requireFluid('minecraft:water')
    .requireFluid('rain:molten_glass')
    .produceItem("3x"+" "+ou_f)
    .requireStructure(structure_f[0],structure_f_key[0])
    .priority(100)
    });

    let list_2 = [
        ['minecraft:golden_carrot','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:night_vision"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:night_vision"}]','minecraft:potion[potion_contents={potion:"minecraft:long_night_vision"}]'],
        ['minecraft:rabbit_foot','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:leaping"}]'],
        ['ars_nouveau:wilden_wing','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:leaping"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:leaping"}]','minecraft:potion[potion_contents={potion:"minecraft:long_leaping"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:night_vision"}]','minecraft:potion[potion_contents={potion:"minecraft:invisibility"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:invisibility"}]','minecraft:potion[potion_contents={potion:"minecraft:long_invisibility"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:long_night_vision"}]','minecraft:potion[potion_contents={potion:"minecraft:long_invisibility"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:leaping"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_leaping"}]'],
        ['minecraft:magma_cream','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:fire_resistance"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:fire_resistance"}]','minecraft:potion[potion_contents={potion:"minecraft:long_fire_resistance"}]'],
        ['minecraft:sugar','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:swiftness"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:swiftness"}]','minecraft:potion[potion_contents={potion:"minecraft:long_swiftness"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:swiftness"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_swiftness"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:swiftness"}]','minecraft:potion[potion_contents={potion:"minecraft:slowness"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:leaping"}]','minecraft:potion[potion_contents={potion:"minecraft:slowness"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:long_leaping"}]','minecraft:potion[potion_contents={potion:"minecraft:long_slowness"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:long_swiftness"}]','minecraft:potion[potion_contents={potion:"minecraft:long_slowness"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:slowness"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_slowness"}]'],
        ['minecraft:turtle_helmet','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:turtle_master"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:turtle_master"}]','minecraft:potion[potion_contents={potion:"minecraft:long_turtle_master"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:turtle_master"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_turtle_master"}]'],
        ['minecraft:pufferfish','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:water_breathing"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:water_breathing"}]','minecraft:potion[potion_contents={potion:"minecraft:long_water_breathing"}]'],
        ['ars_nouveau:wilden_spike','minecraft:potion[potion_contents={potion:"minecraft:water"}]','minecraft:potion[potion_contents={potion:"minecraft:long_water_breathing"}]'],
        ['minecraft:glistering_melon_slice','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:healing"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:healing"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_healing"}]'],
        ['minecraft:spider_eye','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:poison"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:poison"}]','minecraft:potion[potion_contents={potion:"minecraft:long_poison"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:poison"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_poison"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:poison"}]','minecraft:potion[potion_contents={potion:"minecraft:harming"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:long_poison"}]','minecraft:potion[potion_contents={potion:"minecraft:harming"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:healing"}]','minecraft:potion[potion_contents={potion:"minecraft:harming"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:strong_poison"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_harming"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:strong_healing"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_harming"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:strong_harming"}]','minecraft:potion[potion_contents={potion:"minecraft:harming"}]'],
        ['minecraft:ghast_tear','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:regeneration"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:regeneration"}]','minecraft:potion[potion_contents={potion:"minecraft:long_regeneration"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:regeneration"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_regeneration"}]'],
        ['ars_nouveau:wilden_horn','minecraft:potion[potion_contents={potion:"minecraft:water"}]','minecraft:potion[potion_contents={potion:"minecraft:strength"}]'],
        ['minecraft:blaze_powder','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:strength"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:strength"}]','minecraft:potion[potion_contents={potion:"minecraft:long_strength"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"minecraft:strength"}]','minecraft:potion[potion_contents={potion:"minecraft:strong_strength"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:water"}]','minecraft:potion[potion_contents={potion:"minecraft:weakness"}]'],
        ['minecraft:phantom_membrane','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:slow_falling"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:slow_falling"}]','minecraft:potion[potion_contents={potion:"minecraft:slow_falling"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"minecraft:weakness"}]','minecraft:potion[potion_contents={potion:"minecraft:long_weakness"}]'],
        ['minecraft:breeze_rod','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:wind_charged"}]'],
        ['unusualend:end_blob','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:end_infection"}]'],
        ['minecraft:cobweb','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:weaving"}]'],
        ['minecraft:slime_block','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:oozing"}]'],
        ['minecraft:stone','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"minecraft:infested"}]'],
        ['unusualend:lurker_sludge','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:levitation"}]'],
        ['unusualend:golem_orb','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:building_potion"}]'],
        ['unusualend:shiny_crystal','minecraft:potion[potion_contents={potion:"minecraft:long_regeneration"}]','minecraft:potion[potion_contents={potion:"unusualend:regeneration"}]'],
        ['unusualend:shiny_crystal','minecraft:potion[potion_contents={potion:"minecraft:strong_regeneration"}]','minecraft:potion[potion_contents={potion:"unusualend:regeneration_ii"}]'],
        ['unusualend:warped_potion','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:health_boost"}]'],
        ['unusualend:bolok_scale','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:heaviness_potion"}]'],
        ['unusualend:citrine_chunk','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:serenity_potion"}]'],
        ['unusualend:prismalite_gem','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:swift_strikes_potion"}]'],
        ['unusualend:gloopilon_slice','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"unusualend:haste"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"unusualend:haste"}]','minecraft:potion[potion_contents={potion:"unusualend:advanced_haste"}]'],
        ['tombstone:grave_dust','minecraft:potion[potion_contents={potion:"minecraft:water"}]','minecraft:potion[potion_contents={potion:"tombstone:spectral"}]'],
        ['tombstone:thornveil','minecraft:potion[potion_contents={potion:"tombstone:spectral"}]','minecraft:potion[potion_contents={potion:"tombstone:earthly_garden"}]'],
        ['minecraft:ochre_froglight','minecraft:potion[potion_contents={potion:"tombstone:spectral"}]','minecraft:potion[potion_contents={potion:"tombstone:bait"}]'],
        ['minecraft:blue_ice','minecraft:potion[potion_contents={potion:"tombstone:spectral"}]','minecraft:potion[potion_contents={potion:"tombstone:frostbite"}]'],
        ['minecraft:echo_shard','minecraft:potion[potion_contents={potion:"tombstone:spectral"}]','minecraft:potion[potion_contents={potion:"tombstone:darkness"}]'],
        ['minecraft:phantom_membrane','minecraft:potion[potion_contents={potion:"tombstone:spectral"}]','minecraft:potion[potion_contents={potion:"tombstone:discretion"}]'],
        ['tombstone:grave_dust','minecraft:potion[potion_contents={potion:"minecraft:strong_healing"}]','minecraft:potion[potion_contents={potion:"tombstone:restoration"}]'],
        ['occultism:otherworld_essence','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"occultism:third_eye_potion"}]'],
        ['occultism:datura','minecraft:potion[potion_contents={potion:"minecraft:night_vision"}]','minecraft:potion[potion_contents={potion:"occultism:third_eye_potion"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"occultism:third_eye_potion"}]','minecraft:potion[potion_contents={potion:"occultism:long_third_eye_potion"}]'],
        ['minecraft:shulker_shell','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:resistance"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:resistance"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_resistance"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:resistance"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_resistance"}]'],
        ['minecraft:golden_apple','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:absorption"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:absorption"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_absorption"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:absorption"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_absorption"}]'],
        ['minecraft:mushroom_stew','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:haste"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:haste"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_haste"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:haste"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_haste"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"apothic_attributes:haste"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:fatigue"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:fatigue"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_fatigue"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:fatigue"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_fatigue"}]'],
        ['minecraft:wither_skeleton_skull','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:wither"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:wither"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_wither"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:wither"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_wither"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"apothic_attributes:resistance"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:sundering"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:sundering"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_sundering"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:sundering"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_sundering"}]'],
        ['minecraft:experience_bottle','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:knowledge"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:knowledge"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_knowledge"}]'],
        ['minecraft:experience_bottle','minecraft:potion[potion_contents={potion:"apothic_attributes:knowledge"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_knowledge"}]'],
        ['minecraft:sweet_berries','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:vitality"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:vitality"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_vitality"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:vitality"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_vitality"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"apothic_attributes:vitality"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:grievous"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"apothic_attributes:long_vitality"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_grievous"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_vitality"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_grievous"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:grievous"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_grievous"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"apothic_attributes:grievous"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:strong_grievous"}]'],
        ['minecraft:fermented_spider_eye','minecraft:potion[potion_contents={potion:"minecraft:slow_falling"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:levitation"}]'],
        ['minecraft:popped_chorus_fruit','minecraft:potion[potion_contents={potion:"apothic_attributes:levitation"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:flying"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:flying"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:long_flying"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"apothic_attributes:long_flying"}]','minecraft:potion[potion_contents={potion:"apothic_attributes:extra_long_flying"}]'],
        ['ars_nouveau:sourceberry_bush','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:mana_regen_potion"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"ars_nouveau:mana_regen_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:mana_regen_potion_long"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"ars_nouveau:mana_regen_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:mana_regen_potion_strong"}]'],
        ['ars_nouveau:magebloom','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:spell_damage_potion"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"ars_nouveau:spell_damage_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:spell_damage_potion_long"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"ars_nouveau:spell_damage_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:spell_damage_potion_strong"}]'],
        ['ars_nouveau:mendosteen_pod','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:recovery_potion"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"ars_nouveau:recovery_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:recovery_potion_long"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"ars_nouveau:recovery_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:recovery_potion_strong"}]'],
        ['ars_nouveau:bombegranate_pod','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:blasting_potion"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"ars_nouveau:blasting_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:blasting_potion_long"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"ars_nouveau:blasting_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:blasting_potion_strong"}]'],
        ['ars_nouveau:frostaya_pod','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:freezing_potion"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"ars_nouveau:freezing_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:freezing_potion_long"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"ars_nouveau:freezing_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:freezing_potion_strong"}]'],
        ['ars_nouveau:bastion_pod','minecraft:potion[potion_contents={potion:"minecraft:awkward"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:shielding_potion"}]'],
        ['minecraft:redstone','minecraft:potion[potion_contents={potion:"ars_nouveau:shielding_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:shielding_potion_long"}]'],
        ['minecraft:glowstone_dust','minecraft:potion[potion_contents={potion:"ars_nouveau:shielding_potion"}]','minecraft:potion[potion_contents={potion:"ars_nouveau:shielding_potion_strong"}]'],
        
    ]

    list_2.forEach(([in_i1,in_ip,ou_op])=>{
     e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem(in_i1)
    .requireItem(in_ip)
    .requireItem('rain:refining_medicine_factory').chance(0)
    .requireFluid('10x justdirethings:time_fluid_source')
    .requireFluid('10x rain:transmutation_fluid')
    .requireFluid('rain:molten_glass')
    .produceItem(ou_op)
    .requireStructure(structure_f[0],structure_f_key[0])
    .priority(101)
    })

    let potion = []
    list_2.forEach((p1=>{
        potion.push(p1[2])
    }))

    // let npotion = [...new Set(potion)]
    let npotion = []
    for(let i = 0;i<potion.length;i++){
        if(npotion.indexOf(potion[i]) === -1){
            npotion.push(potion[i])

        }
    }
 

    let nnpotion = []
    let lingering = []
    for(let i = 0;i<npotion.length;i++){
        let str = npotion[i]
        let idx = str.indexOf(':')
        if(idx !== -1){
            str = str.slice(0,idx+1)+"splash_"+str.slice(idx+1)
        }
        nnpotion.push(str)
    }

     for(let i = 0;i<npotion.length;i++){
        let str = npotion[i]
        let idx = str.indexOf(':')
        if(idx !== -1){
            str = str.slice(0,idx+1)+"lingering_"+str.slice(idx+1)
        }
        lingering.push(str)
    }

    let i1 = 0

    npotion.forEach(a1=>{
            e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
            .requireEnergy(10000)
            .requireItem(a1)
            .requireItem('minecraft:gunpowder')
            .requireItem('rain:refining_medicine_factory').chance(0)
            .requireFluid('10x justdirethings:time_fluid_source')
            .requireFluid('10x rain:transmutation_fluid')
            .requireFluid('rain:molten_glass')
            .produceItem(nnpotion[i1])
            .requireStructure(structure_f[0],structure_f_key[0])
            .priority(102)

            i1++
    })

     let i2 = 0

    nnpotion.forEach(a1=>{
            e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
            .requireEnergy(10000)
            .requireItem(a1)
            .requireItem('minecraft:dragon_breath')
            .requireItem('rain:refining_medicine_factory').chance(0)
            .requireFluid('10x justdirethings:time_fluid_source')
            .requireFluid('10x rain:transmutation_fluid')
            .requireFluid('rain:molten_glass')
            .produceItem(lingering[i2])
            .requireStructure(structure_f[0],structure_f_key[0])
            .priority(102)

            i2++
    })


    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('justdirethings:polymorphic_catalyst')
    .requireFluid("minecraft:water")
    .produceFluid("justdirethings:polymorphic_fluid_source")

     e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('justdirethings:time_crystal')
    .requireFluid("justdirethings:polymorphic_fluid_source")
    .produceFluid("justdirethings:time_fluid_source")

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('#c:glass_blocks')
    .produceFluid("rain:molten_glass")

     e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('rain:void_mixture')
    .requireFluid("minecraft:water")
    .produceFluid('rain:void_fluid')

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('minecraft:chorus_fruit')
    .requireFluid("rain:void_fluid")
    .produceFluid('rain:transmutation_fluid')

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombie"]')
    .requireFluid("60000x minecraft:water")
    .produceItem('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:drowned"]')

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]')
    .requireFluid("10000x rain:transmutation_fluid")
    .produceItem('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:pig"]')

    //  e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    // .requireEnergy(10000)
    // .requireItem('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]')
    // .requireFluid("10000x rain:transmutation_fluid")
    // .produceItem('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:pig"]')
    // .requireStructure(structure_f[1],structure_f_key[1])

    const list_3 = [
        ['minecraft:crafting_table','ae2:molecular_assembler'],
        ['actuallyadditions:lens','actuallyadditions:lens_of_color'],
        ['actuallyadditions:canola_seeds','actuallyadditions:crystallized_canola_seed'],
        ['minecraft:red_mushroom','minecraft:nether_wart'],
        ['minecraft:rotten_flesh','minecraft:leather'],
        ['minecraft:chest','ae2:storage_bus'],
        ['minecraft:diamond','actuallyadditions:diamatine_crystal'],
        ['#c:seeds','mysticalagriculture:prosperity_seed_base'],
        ['minecraft:iron_block','actuallyadditions:enori_crystal_block'],
        ['actuallyadditions:laser_relay','actuallyadditions:laser_relay_fluids'],
        ['minecraft:lapis_block','actuallyadditions:palis_crystal_block' ],
        ['ae2:blank_pattern','ae2:pattern_provider'],
        ['minecraft:quartz','minecraft:prismarine_shard'],
        ['minecraft:iron_ingot','actuallyadditions:enori_crystal'],
        ['#c:sands','minecraft:soul_sand'],
        ['minecraft:chiseled_quartz_block','actuallyadditions:ethetic_green_block'],
        ['minecraft:diamond_block','actuallyadditions:diamatine_crystal_block'],
        ['minecraft:emerald','actuallyadditions:emeradic_crystal'],
        ['minecraft:emerald_block','actuallyadditions:emeradic_crystal_block'],
        ['minecraft:lapis_lazuli','actuallyadditions:palis_crystal'],
        ['#minecraft:coals','actuallyadditions:void_crystal'],
        ['minecraft:quartz_block','actuallyadditions:ethetic_white_block'],
        ['minecraft:redstone','actuallyadditions:restonia_crystal'],
        ['minecraft:coal_block','actuallyadditions:void_crystal_block'],
        ['minecraft:redstone_block','actuallyadditions:restonia_crystal_block'],
        ['actuallyadditions:laser_relay_fluids','actuallyadditions:laser_relay_item'],
        ['actuallyadditions:lens_of_color','actuallyadditions:lens_of_detonation'],
        ['actuallyadditions:lens_of_detonation','actuallyadditions:lens_of_certain_death'],
        ['actuallyadditions:lens_of_certain_death','actuallyadditions:lens'],
        ['minecraft:stone','minecraft:bedrock'],
        ['#minecraft:saplings','integrateddynamics:menril_sapling'],
        ['actuallyadditions:laser_relay_item','actuallyadditions:laser_relay'],
        ['rain:seed_press','rain:atomic_reconstruction_chamber']
    ]

    list_3.forEach(([int,out])=>{
     e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem(int)
    .requireItem('rain:atomic_reconstruction_chamber').chance(0)
    .requireFluid("rain:atomic_reconstruct_fluid").chance(0)
    .produceItem(out)
    .requireStructure(structure_f[2],structure_f_key[2])
    .requireTime("(,12000)")
    })

     list_3.forEach(([int,out])=>{
     e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem(int)
    .requireItem('rain:atomic_reconstruction_chamber').chance(0)
    .requireFluid("rain:atomic_reconstruct_fluid").chance(0)
    .produceItem(out)
    .requireStructure(structure_f[2],structure_f_key[2])
    .requireStructure(structure_f[3],structure_f_key[3])
    })

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(1000000)
    .requireItem('rain:prophecy_matrix').chance(0)
    .requireItem('hostilenetworks:blank_data_model')
    .requireItem('64x rain:basic_prophrcy_fragments')
    .produceItem('hostilenetworks:data_model').chance(0.1)
    .requireStructure(structure_f[4],structure_f_key[4])

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',20)
    .requireEnergy(100000000)
    .requireItem('rain:prophecy_matrix').chance(0)
    .requireItem('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:command_block_minecart"]').chance(0)
    .requireItem('64x hostilenetworks:prediction_matrix')
    .produceItem('minecraft:command_block').chance(0.5)
    .requireStructure(structure_f[4],structure_f_key[4])
    // 专用模型配方优先于接受任意数据模型的 rain:fire 配方。
    .priority(100)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',20)
    .requireEnergy(100000)
    .requireItem('rain:prophecy_matrix').chance(0)
    .requireItem('hostilenetworks:data_model').chance(0)
    .requireItem('hostilenetworks:prediction_matrix')
    .requireFluid("minecraft:lava")
    .produceItem('rain:fire').chance(0.5)
    .requireStructure(structure_f[4],structure_f_key[4])


    // const list_4 = [

    // ]

    // list_4.forEach(()=>{

    // })
    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('reliquary:glowing_bread')
    .requireItem('minecraft:honey_bottle')
    .requireItem('rain:refining_medicine_factory').chance(0)
    .requireFluid('10x justdirethings:time_fluid_source')
    .requireFluid('10x rain:transmutation_fluid')
    .requireFluid('rain:molten_glass')
    .produceItem('minecraft:ominous_bottle')
    .requireStructure(structure_f[0],structure_f_key[0])
    .priority(101)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('minecraft:redstone')
    .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=0]')
    .requireItem('rain:refining_medicine_factory').chance(0)
    .requireFluid('10x justdirethings:time_fluid_source')
    .requireFluid('10x rain:transmutation_fluid')
    .requireFluid('rain:molten_glass')
    .produceItem('minecraft:ominous_bottle[ominous_bottle_amplifier=1]')
    .requireStructure(structure_f[0],structure_f_key[0])
    .priority(101)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('minecraft:redstone')
    .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=1]')
    .requireItem('rain:refining_medicine_factory').chance(0)
    .requireFluid('10x justdirethings:time_fluid_source')
    .requireFluid('10x rain:transmutation_fluid')
    .requireFluid('rain:molten_glass')
    .produceItem('minecraft:ominous_bottle[ominous_bottle_amplifier=2]')
    .requireStructure(structure_f[0],structure_f_key[0])
    .priority(102)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('minecraft:redstone')
    .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=2]')
    .requireItem('rain:refining_medicine_factory').chance(0)
    .requireFluid('10x justdirethings:time_fluid_source')
    .requireFluid('10x rain:transmutation_fluid')
    .requireFluid('rain:molten_glass')
    .produceItem('minecraft:ominous_bottle[ominous_bottle_amplifier=3]')
    .requireStructure(structure_f[0],structure_f_key[0])
    .priority(102)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(10000)
    .requireItem('minecraft:redstone')
    .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=3]')
    .requireItem('rain:refining_medicine_factory').chance(0)
    .requireFluid('10x justdirethings:time_fluid_source')
    .requireFluid('10x rain:transmutation_fluid')
    .requireFluid('rain:molten_glass')
    .produceItem('minecraft:ominous_bottle[ominous_bottle_amplifier=4]')
    .requireStructure(structure_f[0],structure_f_key[0])
    .priority(102)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem('actuallyadditions:void_sack')
    // .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=3]')
    .requireItem('rain:large_fluid_processing').chance(0)
    .requireFluid('1000x rain:transmutation_fluid')
    .requireFluid('1000x rain:spent_unclear_waste')
    .requireFluid('1000x rain:remmant')
    .requireFluid('1000x rain:unstable_dimensional_fluid')
    .produceItem('ars_nouveau:sourceberry_bush')
    .requireStructure(structure_f[1],structure_f_key[1])
    .priority(101)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem('unusualend:warped_balloon')
    // .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=3]')
    .requireItem('rain:large_fluid_processing').chance(0)
    .requireFluid('1000x ifeu:liquid_sculk_matter')
    .produceItem('immersiveengineering:warning_sign_shrieker')
    .requireStructure(structure_f[1],structure_f_key[1])
    .priority(101)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem('ae2:singularity')
    // .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=3]')
    .requireItem('rain:large_fluid_processing').chance(0)
    .requireFluid('500x ifeu:liquid_sculk_matter')
    .requireFluid('500x rain:antimatter_fluid')
    .requireFluid('500x rain:uu_material')
    .produceItem('mekanism:pellet_antimatter')
    .requireStructure(structure_f[1],structure_f_key[1])
    .priority(101)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem('occultism:dragonyst_dust')
    // .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=3]')
    .requireItem('rain:large_fluid_processing').chance(0)
    .requireFluid('500x rain:spent_unclear_waste')
    .requireFluid('50x rain:antimatter_fluid')
    .requireFluid('100x rain:uu_material')
    .produceItem('unusualend:bolok_scale')
    .requireStructure(structure_f[1],structure_f_key[1])
    .priority(101)

    e.recipes.custommachinery.custom_machine('custommachinery:fluid_processing',100)
    .requireEnergy(100000)
    .requireItem('minecraft:pig_spawn_egg')
    // .requireItem('minecraft:ominous_bottle[ominous_bottle_amplifier=3]')
    .requireItem('rain:large_fluid_processing').chance(0)
    .requireItem('avaritia:blaze_hoe').chance(0)
    .requireFluid('1000x mysticalagradditions:molten_soulium')
    .requireFluid('1000x allthemodium:soul_lava')
    .produceItem('draconicevolution:mob_soul')
    .requireStructure(structure_f[1],structure_f_key[1])
    .priority(101)
})





