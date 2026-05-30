ServerEvents.recipes(event => {

//   event.recipes.custommachinery.custom_machine('custommachinery:structure_inspector', 10000)
//   .runCommandOnStart("/tell @a 1111")

const structure_f =[
     [["aaaaaaa","aaaaaaa","aaaaaaa","aaaaaaa","aaaaaaa","aaaaaaa","aaaaaaa"],
["       "," bbbbb "," bbbbb "," bbbbb "," bbbbb "," ccdcc ","   m   "],
["       "," eeeee "," eeeee "," eeeee "," eeeee "," fffff ","       "],
["       "," ghhhg "," hiiih "," hiiih "," ghhhg ","       ","       "],
["       ","       ","  lll  ","  lll  ","       ","       ","       "]],

[["aaaaa","aaaaa","aaaaa","aaaaa","aaaaa"],
["  b  "," ccc ","bcccb"," cdc ","  m  "],
["     "," ccc "," ccc "," ccc ","     "],
["     "," eee "," ege "," eee ","     "],
["     ","     ","  h  ","     ","     "]],

[
["             ","             ","             ","             ","             ","             ","      a      ","             ","             ","             ","             ","             ","             "],
["             ","             ","             ","             ","             ","      a      ","     aba     ","      a      ","             ","             ","             ","             ","             "],
["             ","             ","             ","             ","      a      ","     aba     ","    abbba    ","     aba     ","      a      ","             ","             ","             ","             "],
["             ","             ","             ","      a      ","     aca     ","    accca    ","   accccca   ","    accca    ","     aca     ","      a      ","             ","             ","             "],
["             ","             ","      a      ","     ada     ","    addda    ","   addddda   ","  adddeddda  ","   addddda   ","    addda    ","     ada     ","      a      ","             ","             "],
["             "," ff       ff "," f         f ","             ","             ","             ","      m      ","             ","             ","             "," f         f "," ff       ff ","             "],
[" ff       ff ","fggdddddddggf","fgddhhhhhddgf"," ddh     hdd "," dh       hd "," dh       hd "," dh       hd "," dh       hd "," dh       hd "," ddh     hdd ","fgddhhhhhddgf","fggdddddddggf"," ff       ff "],
[" ff       ff ","fgghhhhhhhggf","fghh     hhgf"," hh       hh "," h         h "," h         h "," h         h "," h         h "," h         h "," hh       hh ","fghh     hhgf","fgghhhhhhhggf"," ff       ff "],
["             "," ff       ff "," f         f ","             ","             ","             ","             ","             ","             ","             "," f         f "," ff       ff ","             "]
],

[["         ","         ","         ","         ","    a    ","         ","         ","         ","         "],
["         ","         ","         ","    a    ","   aba   ","    a    ","         ","         ","         "],
["         ","         ","    a    ","   aca   ","  accca  ","   aca   ","    a    ","         ","         "],
["         ","    a    ","   ada   ","  addda  "," addddda ","  addda  ","   ada   ","    a    ","         "]
,["    e    ","   efe   ","  efgfe  "," efgggfe ","efgggggfe"," efgggfe ","  efgfe  ","   ehe   ","    m    "],
["         ","    a    ","   aia   ","   iiia  "," aiiiiia ","  aiiia  ","   aia   ","    a    ","         "],
["         ","         ","    a    ","   aja   ","  ajjja  ","   aja   ","    a    ","         ","         "],
["         ","         ","         ","    a    ","   aka   ","    a    ","         ","         ","         "],
["         ","         ","         ","         ","    a    ","         ","         ","         ","         "]],

[
["                            ","                            ","                            ","                            ","abbbbbacccccddddcccccabbbbba","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeefacccccddddcccccafeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","abbbbbacccccddddcccccabbbbba","                            ","                            ","                            ","                            "],["                            ","                            ","                            ","abbbbbacccccggggcccccabbbbba","h            ii            h","h            ii            h","h           jiijj          h","h           kkkkk          h","h   lllnnnnnkoooknnnnlll   h","h   lplnnnnnkoooknnnnlpl   h","h   lllnnnnnkkkkknnnnlll   h","h           qiiqq          h","h            ii            h","h            ii            h","h            ii            h","abbbbbacccccggggcccccabbbbba","                            ","                            ","                            "],
["                            ","                            ","abbbbbacccccggggcccccabbbbba","h            ii            h","h                          h","h                          h","h                          h","h           rrrrr          h","h           rooor          h","h    s      rooor     s    h","h           rrrrr          h","h                          h","h                          h","h                          h","h                          h","h            ii            h","abbbbbacccccggggcccccabbbbba","                            ","                            "],["                            ","abbbbbacccccggggcccccabbbbba","h            ii            h","h                          h","h                          h","h                          h","h                          h","h           rrrrr          h","h           rooor          h","h    s      rooor     s    h","h           rrrrr          h","h                          h","h                          h","h                          h","h                          h","h                          h","h            ii            h","abbbbbacccccggggcccccabbbbba","                            "],
["abbbbbacccccttttcccccabbbbba","h            ii            h","h                          h","h                          h","h                          h","h                          h","h                          h","h           rrrrr          h","h           rooor          h","h    s      rooor     s    h","h           rrrrr          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h            ii            h","abbbbbacccccttttcccccabbbbba"],["auuuuuacccccttttcccccauuuuua","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h           vvvvv          h","h           vooov          h","h    w      vooov     s    h","h           vvvvv          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","auuuuuacccccttttcccccauuuuua"],
["auuuuuacccccttttcccccauuuuua","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h           xxxxx          h","h           xyyyx          h","h    A      xyyyx     w    h","h           xxxxx          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","auuuuuacccccttttcccccauuuuua"],["auuuuuaccccc    cccccauuuuua","h lll                      h","h                          h","h                          h","h                          h","h             B            h","h             C            h","h             f            h","h   DE       yyy           h","h   DE       yFy      A    h","h   DE        m            h","h                          h","h                          h","h                          h","hl                         h","hl                         h","hl                         h","h       lll                h","auuuuuaccccc    cccccauuuuua"],
["auufuuaccccc    cccccauuuuua","h lpl  lll                lh","h  G                      lh","h  HI                     lh","h   JI                     h","h   HK   LM   s            h","h    N  OP                 h","h   DE  G                  h","h   DE OQ    yyy      ER   h","h   DESP     yyy      ER   h","h   DE                ER   h","h   DE                     h","h    T                     h","h   OUVI                   h","hl OP  HI                  h","fpVP    HI                lh","hl       G                lh","h       lpl               lh","auuuuuaccfcc    cccccauuuuua"],["auuuuuacfccc    cccccauuuuua","h lll  lpl                lh","h       HWI             LVpf","h         HI           OP lh","h          G           G   h","h        XYUVVYVVI    OP   h","h                HVI  N    h","h                  HI ER   h","h   DE  w           HIER   h","h   DE               NER   h","h   DE                ER   h","h                     ER   h","h                     T    h","h                     G    h","hl                    HI   h","hl                     HI lh","hl                      HVpf","h       lll               lh","auuuuuaccccc    cccccauuuuua"],
["auuuuuaccccc    cccccauuuuua","h      lll                lh","h                       w lh","h                         lh","h                          h","h                          h","h                          h","h                          h","h                     ER   h","h    A                ER   h","h                     ER   h","h                          h","h                          h","h                          h","h                          h","h                         lh","h                         lh","h                         lh","auuuuuaccccc    cccccauuuuua"],["auuuuuaccccc    cccccauuuuua","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                     A    h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","auuuuuaccccc    cccccauuuuua"],
["auuuuuacccccttttcccccauuuuua","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","auuuuuacccccttttcccccauuuuua"],["auuuuuacccccttttcccccauuuuua","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","auuuuuacccccttttcccccauuuuua"],
["abbbbbacccccttttcccccabbbbba","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","abbbbbacccccttttcccccabbbbba"],["                            ","abbbbbacccccggggcccccabbbbba","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","abbbbbacccccggggcccccabbbbba","                            "],
["                            ","                            ","abbbbbacccccggggcccccabbbbba","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","abbbbbacccccggggcccccabbbbba","                            ","                            "],["                            ","                            ","                            ","abbbbbacccccggggcccccabbbbba","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","h                          h","abbbbbacccccggggcccccabbbbba","                            ","                            ","                            "],
["                            ","                            ","                            ","                            ","abbbbbacccccddddcccccabbbbba","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeacccccddddcccccaeeeeea","aeeeeeaccccc dddcccccaeeeeea","abbbbbacccccddddcccccabbbbba","                            ","                            ","                            ","                            "]
],

[
["aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaaaaaaaaaaaaa","aaa        aaa","aaa        aaa"],
["              "," bccccccccccb "," cddddddddddc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeefgefeedc "," cddd mh dddc "," bc        cb ","              ","              "],
["              "," bccccccccccb "," cddddddddddc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeffffeedc "," cddd    dddc "," bc        cb ","              ","              "],
["              "," bccccccccccb "," cddddddddddc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cdeeeeeeeedc "," cddddddddddc "," bc        cb ","              ","              "],
["              "," bccccccccccb "," cddddddddddc "," cdiiiiiiiidc "," cdiiiiiiiidc "," cdiiiiiiiidc "," cdiiiiiiiidc "," cdiiiiiiiidc "," cddddddddddc "," bc        cb ","              ","              "],
["              ","              ","  jjjjjjjjjj  ","  jjjjjjjjjj  ","  jjjjjjjjjj  ","  jjjjjjjjjj  ","  jjjjjjjjjj  ","  jjjjjjjjjj  ","  jjjjjjjjjj  ","              ","              ","              "]
],

[
["aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bccc cccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bcccccccccccccccccccccccb  ","  bbbbbbbbbbbbdbbbbbbbbbbbb  ","              m              ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  beeeeeeeeeeeeeeeeeeeeeeeb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b      hhhhhhhhhhh      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjkjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      illllllllli      b  ","  b      illllllllli      b  ","  b      illllllllli      b  ","  b      illllllllli      b  ","  b      illllklllli      b  ","  b      illllllllli      b  ","  b      illllllllli      b  ","  b      illllllllli      b  ","  b      illllllllli      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      innnnnnnnni      b  ","  b      innnnnnnnni      b  ","  b      innnnnnnnni      b  ","  b      innnnnnnnni      b  ","  b      innn knnnni      b  ","  b      innnnnnnnni      b  ","  b      innnnnnnnni      b  ","  b      innnnn nnni      b  ","  b      innnn nnnni      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i    k    i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i    k    i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      i         i      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      ioooooooooi      b  ","  b      ioooooooooi      b  ","  b      ioooooooooi      b  ","  b      ioooooooooi      b  ","  b      iooookooooi      b  ","  b      ioooooooooi      b  ","  b      ioooooooooi      b  ","  b      ioooooooooi      b  ","  b      ioooooooooi      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjj jjjji      b  ","  b      ijjjj jjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      ijjjjjjjjji      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bf          f          fb  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b     g           g     b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b      iiiiiiiiiii      b  ","  b     g           g     b  ","  b                       b  ","  b                       b  ","  b                       b  ","  b                       b  ","  bf          f          fb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "],
["                             ","                             ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbbbbbbbbbbbbb  ","                             ","                             "]
],

]

const structure_k =[
    {"a":"minecraft:bedrock",
"b":"minecraft:iron_block",
"c":"mekanism:ultimate_fluid_tank",
"d":"minecraft:redstone_block",
"e":"alltheores:steel_block",
"f":"advanced_ae:quantum_alloy_block",
"g":"alltheores:nickel_block",
"h":"alltheores:platinum_block",
"i":"naturesaura:golden_leaves",
"l":"oritech:machine_core_7"},

{"a":"minecraft:bedrock",
"b":"minecraft:ancient_debris",
"c":"minecraft:obsidian",
"d":"minecraft:redstone_block",
"e":"enderio:fluid_tank",
"g":"allthemodium:allthemodium_block",
"h":"minecraft:chest"},

{"a":"alltheores:steel_block",
"b":"allthemodium:allthemodium_block",
"c":"allthemodium:vibranium_block",
"d":"ae2:quartz_vibrant_glass",
"e":"minecraft:redstone_block",
"f":"alltheores:lead_block",
"g":"stellaris:uranium_block",
"h":"advanced_ae:quantum_alloy_block"},

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

const text1 = [
    "cm.rain.player.tell.info-1",
    "cm.rain.player.tell.info-2",
    "cm.rain.player.tell.info-3",
    "cm.rain.player.tell.info-4",
    "cm.rain.player.tell.info-5",
    "cm.rain.player.tell.info-6",
    "cm.rain.player.tell.info-7"

]
for(let i = 0;i<text1.length;i++){
      event.recipes.custommachinery.custom_machine('custommachinery:structure_inspector', 10000)
      .runCommandOnStart(`/tellraw @a {"translate":"${text1[i]}","color":"rainbow"}`)
      .requireStructure(structure_f[i],structure_k[i])
}
  
})