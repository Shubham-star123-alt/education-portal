<?php
header("Content-Type: application/json");
include "db.php";

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];
$password = $data["password"];

// Find user by email
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
  $user = $result->fetch_assoc();
  if (password_verify($password, $user["password"])) {
    echo json_encode(["message" => "Login successful"]);
  } else {
    echo json_encode(["message" => "Invalid password"]);
  }
} else {
  echo json_encode(["message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
