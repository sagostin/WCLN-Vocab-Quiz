<!DOCTYPE html>
<html>

<?php
$version = $_GET['version'];

if(!isset($version)){
    die("Invalid version.");
}

if(!preg_match("/([A-Za-z0-9_])\w+/", $version)){
    die("Invalid version.");
}

if (!file_exists("versions/" . $version . ".js")) {
    die("Invalid version.");
}

?>

<body onload="init()">

<script src="js/createjs.min.js"></script>

<canvas height="600" id="gameCanvas" style="border:1px solid #d3d3d3;" width="800">
    Your browser does not support the HTML5 canvas tag.
</canvas>
<?php echo "<script src='versions/$version.js'></script>";?>
<script src="js/game.js"></script>

</body>
</html>
