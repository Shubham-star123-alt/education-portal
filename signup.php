<?php
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"];
$email = $data["email"];
$password = $data["password"];

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
  echo json_encode(["message" => "Email already registered"]);
} else {
  // Hash password
  $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

  $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sss", $name, $email, $hashedPassword);

  if ($stmt->execute()) {
    echo json_encode(["message" => "Signup successful"]);
  } else {
    echo json_encode(["message" => "Error: " . $stmt->error]);
  }

  $stmt->close();
}

$check->close();
$conn->close();
?>
