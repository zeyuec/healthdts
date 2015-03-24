<?php


function readFromFile() {
    $chartDB = array();
    $handle = fopen("data", "r");
    if ($handle) {
        while (($line = fgets($handle)) !== false) {
            $num = explode("\t", $line);
            if ($num[1] > 4800) {
                $chartDB[$num[0]]['d'] = 100;
            } else {
                $chartDB[$num[0]]['d'] = (int)($num[1]/4800.0*100);
            }
            $chartDB[$num[0]]['s'] = $num[2];
            $chartDB[$num[0]]['m'] = ($num[3]+20)/40.0*100;
            /* var_dump($chartDB); */
            /* // process the line read. */
        }
        fclose($handle);
    } else {
        // error opening the file.
    }
    return $chartDB;
}

$db = readFromFile();
/* var_dump($db); */



date_default_timezone_set("America/New_York");

/* for debug */
$startStr = '2015-03-24T04:00:00.000Z';
$endStr = '2015-04-25T03:59:59.999Z';

/* get params */
$startStr = $_POST['start'];
$endStr = $_POST['end'];

/* set start and end */
$start = new DateTime($startStr);
$end= new DateTime($endStr);

/* get three data */
$chartData = array();
$cur = $start;
$avgS = 0;
$avgM = 0;
$avgD = 0;
$count = 0;
while ($cur->format('Ymd') != $end->format('Ymd')) {
    $date = $cur->format('Ymd');
    $chartData[$date] = array(
        $db[$date]['s'],
        $db[$date]['m'],
        $db[$date]['d']);
    $avgS += $db[$date]['s'];
    $avgM += $db[$date]['m'];
    $avgD += $db[$date]['d'];
    $count++;
    $cur = $cur->add(date_interval_create_from_date_string('1 day'));
}

$score = $avgS/$count * 0.5 + $avgM/$count*0.3 + $avgD/$count * 0.2;

$ret = array(
    'score' => number_format($score, 2, '.', ''),
    'chart' => $chartData
    );

echo json_encode($ret);
?>