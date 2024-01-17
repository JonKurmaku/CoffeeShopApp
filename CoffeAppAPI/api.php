<?php

include 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

$sql = "SELECT * FROM orders";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    }   
else {
    echo "No orders found";
     }

}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents("php://input");
    $json_obj = json_decode($json_data);
    
    $fullName = htmlspecialchars($json_obj->fullName);
    $email = htmlspecialchars($json_obj->email);
    $description = htmlspecialchars($json_obj->description);

    $sql = "INSERT INTO orders (orders_name, orders_email, orders_description) VALUES ('$fullName', '$email', '$description')";

    if ($conn->query($sql) === TRUE) {

        $newOrder = [
            'fullName' => $fullName,
            'email' => $email,
            'description' => $description
        ];

        echo json_encode(["message" => "Order added successfully", "order" => $newOrder]);
    } else {
        echo json_encode(["error" => "Failed to add the order"]);
    }
}


elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $json_data = file_get_contents("php://input");
    $json_obj = json_decode($json_data, true);

    if ($json_obj !== null) {
        $id = htmlspecialchars($json_obj['id']);
        $fullName = htmlspecialchars($json_obj['fullName']);
        $email = htmlspecialchars($json_obj['email']);
        $description = htmlspecialchars($json_obj['description']);

        $sql = "UPDATE orders SET 
                orders_name = '$fullName', 
                orders_email = '$email', 
                orders_description = '$description' 
                WHERE orders_id = $id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Record updated successfully']);
        } else {
            echo json_encode(['error' => 'Error updating record: ' . $conn->error]);
        }
    } else {
        echo json_encode(['error' => 'Invalid JSON data']);
    }
}




elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $json_data = file_get_contents("php://input");
    $json_obj = json_decode($json_data);

        if (isset($json_obj->id)) {
            $id = $json_obj->id;
            $sql = "DELETE FROM orders WHERE orders_id = $id";

            if ($conn->query($sql) === TRUE) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . $conn->error;
            }
        } 
}

$conn->close();
?>