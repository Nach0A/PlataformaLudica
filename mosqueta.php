<?php
$saldo = 500;
$mensaje = " ";
$vasos = ['', '', '*'];
$premio = rand(0, 2);
for ($i=0; $i < 3; $i++) {
    if ($i != $premio) {
        echo "* <br>";
    } else {
        echo "[{$vasos[$premio]}] <br>";
     }

}
echo "<br>";

$premio = rand(0, 2);
for ($i=0; $i < 3; $i++) {
    if ($i != $premio) {
        echo "* <br>";
    } else {
        echo "[{$vasos[$premio]}] <br>";
    }
}
echo "<br>";

$premio = rand(0, 2);
for ($i=0; $i < 3; $i++) {
    if ($i != $premio) {
        echo "* <br>";
    } else {
        echo "[{$vasos[$premio]}] <br>";
    }
}

echo "<br>";
for ($i=0; $i < 3; $i++) {
    if ($i != $premio) {
        echo "* <br>";
    } else {
        echo "{$vasos[$premio]} <br>";
    }
}

$eleccion = $_GET["eleccion"];

echo "{$premio}";
if (is_integer($eleccion) == 1) {
        if ($eleccion == $premio) {
            $mensaje = "Ganaste";
            echo "{$mensaje} <br>";
            $saldo += 200;
            echo "Saldo: {$saldo}";
    } else {
            $mensaje = "Perdiste";
            echo "{$mensaje} <br>";
            $saldo -= 200;
            echo "Saldo: {$saldo}";
    }
}
?>
sfdj