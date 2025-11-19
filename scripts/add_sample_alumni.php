<?php
/**
 * Add Sample Alumni Data ke Firestore
 * 
 * Usage:
 * php scripts/add_sample_alumni.php
 */

require_once __DIR__ . '/../config.php';

// Force enable Firebase
define('FIREBASE_ENABLED', 'true');

$db = getDBConnection();

if (!$db) {
    die("❌ Failed to connect to Firestore. Please check service account key.\n");
}

echo "✅ Firestore connected!\n\n";

// Sample alumni data
$sampleAlumni = [
    [
        'name' => 'Ahmad bin Abdullah',
        'matric' => 'B1234567',
        'batch' => '2020',
        'current_company' => 'Tech Solutions Sdn Bhd',
        'bio' => 'Senior Software Engineer',
        'description' => 'Graduated from BITA program in 2024. Specialized in cloud computing and web development.',
        'instagram' => 'https://instagram.com/ahmad',
        'linkedin' => 'https://linkedin.com/in/ahmad',
        'created_at' => dateTimeToFirestoreTimestamp(new DateTime('2024-01-15'))
    ],
    [
        'name' => 'Siti Nurhaliza binti Hassan',
        'matric' => 'B1234568',
        'batch' => '2019',
        'current_company' => 'Cloud Services Malaysia',
        'bio' => 'Cloud Architect',
        'description' => 'Specialized in AWS and Azure cloud platforms. Passionate about DevOps and automation.',
        'linkedin' => 'https://linkedin.com/in/siti',
        'twitter' => 'https://twitter.com/siti',
        'created_at' => dateTimeToFirestoreTimestamp(new DateTime('2024-01-10'))
    ],
    [
        'name' => 'Muhammad Firdaus bin Ismail',
        'matric' => 'B1234569',
        'batch' => '2021',
        'current_company' => 'Digital Innovation Lab',
        'bio' => 'Full Stack Developer',
        'description' => 'Expert in React, Node.js, and cloud technologies. Building innovative web solutions.',
        'linkedin' => 'https://linkedin.com/in/firdaus',
        'created_at' => dateTimeToFirestoreTimestamp(new DateTime('2024-01-20'))
    ]
];

// Add to Firestore
$alumniCollection = $db->collection('alumni');

echo "📦 Adding sample alumni...\n\n";

foreach ($sampleAlumni as $index => $alumni) {
    try {
        $docRef = $alumniCollection->add($alumni);
        echo "  ✅ [{$index}] Added alumni: {$alumni['name']} (ID: {$docRef->id()})\n";
    } catch (Exception $e) {
        echo "  ❌ [{$index}] Failed to add alumni: {$alumni['name']} - {$e->getMessage()}\n";
    }
}

echo "\n🎉 Sample alumni added successfully!\n";
echo "\n📋 Next steps:\n";
echo "   1. Test connection: http://localhost/bita/api/test_firestore.php\n";
echo "   2. Get alumni: http://localhost/bita/api/get_alumni.php (after enabling Firebase)\n";
echo "   3. Check Firebase Console: https://console.firebase.google.com\n";
?>

