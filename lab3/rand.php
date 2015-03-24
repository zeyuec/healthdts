<?php
/* for ($i=0; $i<100; $i++) { */
/*     echo rand(2000, 7500)."\n"; */
/* } */

/* for ($i=0; $i<100; $i++) { */
/*     echo rand(20, 100)."\n"; */
/* } */

for ($i=0; $i<100; $i++) {
    if ($i % 4 > 1) {
        echo rand(10, 20)."\n";
    } else {
        echo rand(-10, 0)."\n";
    }
}


?>