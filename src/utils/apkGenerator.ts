import JSZip from 'jszip';

export async function generateAndroidZip(): Promise<Blob> {
  const zip = new JSZip();

  // Attach logo files directly to zip
  try {
    const logoRes = await fetch('/logo.png');
    if (logoRes.ok) {
      const logoBlob = await logoRes.blob();
      zip.file('logo.png', logoBlob);
      zip.file('app/src/main/res/drawable/logo.png', logoBlob);
      zip.file('app/src/main/res/mipmap-mdpi/ic_launcher.png', logoBlob);
      zip.file('app/src/main/res/mipmap-hdpi/ic_launcher.png', logoBlob);
      zip.file('app/src/main/res/mipmap-xhdpi/ic_launcher.png', logoBlob);
      zip.file('app/src/main/res/mipmap-xxhdpi/ic_launcher.png', logoBlob);
      zip.file('app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', logoBlob);
      zip.file('app/src/main/res/mipmap-mdpi/ic_launcher_round.png', logoBlob);
      zip.file('app/src/main/res/mipmap-hdpi/ic_launcher_round.png', logoBlob);
      zip.file('app/src/main/res/mipmap-xhdpi/ic_launcher_round.png', logoBlob);
      zip.file('app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png', logoBlob);
      zip.file('app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', logoBlob);
    }
    const svgRes = await fetch('/icon.svg');
    if (svgRes.ok) {
      const svgText = await svgRes.text();
      zip.file('icon.svg', svgText);
      zip.file('app/src/main/res/drawable/icon.svg', svgText);
    }
  } catch (e) {
    console.warn('Could not fetch logo for zip', e);
  }

  // Root files
  zip.file(
    'build.gradle.kts',
    `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`
  );

  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TabungHarapan"
include(":app")
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  zip.file(
    'README-BUILD-APK.md',
    `# TABUNG HARAPAN - PANDUAN BINA APK ANDROID

Aplikasi Android Native lengkap untuk Pengurusan Simpanan Peribadi dengan tema Material 3 Soft Pink / Rose.

- **Nama Aplikasi**: TABUNG HARAPAN
- **Package Name**: com.tabungharapan2026.app
- **Output File**: TabungHarapan.apk
- **Penyimpanan Data**: Android Room Local Database (SQLite offline, tanpa server)

## 3 LANGKAH BINA APK DALAM ANDROID STUDIO:
1. Buka Android Studio -> Open Project -> Pilih folder "TabungHarapan_Android_Project".
2. Tunggu Gradle sync selesai.
3. Klik menu atas: Build > Build Bundle(s) / APK(s) > Build APK(s).
   Fail APK siap dijana di: app/build/outputs/apk/debug/app-debug.apk!
`
  );

  // gradle/libs.versions.toml
  zip.file(
    'gradle/libs.versions.toml',
    `[versions]
agp = "8.3.1"
kotlin = "2.0.0"
coreKtx = "1.12.0"
lifecycleRuntimeKtx = "2.7.0"
activityCompose = "1.8.2"
composeBom = "2024.02.00"
room = "2.6.1"
ksp = "2.0.0-1.0.21"
material3 = "1.2.0"
navigationCompose = "2.7.7"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
`
  );

  // app/build.gradle.kts
  zip.file(
    'app/build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.tabungharapan2026.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.tabungharapan2026.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    ksp(libs.room.compiler)

    debugImplementation(libs.androidx.ui.tooling)
}
`
  );

  // AndroidManifest.xml
  zip.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.TabungHarapan2026">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.TabungHarapan2026">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  // RES RESOURCES (CRITICAL: Fixes AAPT style/Theme.TabungHarapan2026 not found error!)
  zip.file(
    'app/src/main/res/values/themes.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.TabungHarapan2026" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#FFF5F6</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values-night/themes.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.TabungHarapan2026" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#FFF5F6</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/colors.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="rose_primary">#E11D48</color>
    <color name="rose_on_primary">#FFFFFF</color>
    <color name="rose_primary_container">#FFE4E6</color>
    <color name="rose_on_primary_container">#9F1239</color>
    <color name="rose_background">#FFF5F6</color>
    <color name="rose_surface">#FFFFFF</color>
    <color name="rose_surface_variant">#FFEBF0</color>
    <color name="text_main">#1E293B</color>
    <color name="text_secondary">#64748B</color>
    <color name="maybank_yellow">#EAB308</color>
    <color name="alliance_blue">#2563EB</color>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">TABUNG HARAPAN</string>
    <string name="dashboard">Ringkasan</string>
    <string name="transaksi">Transaksi</string>
    <string name="tabung">Tabung</string>
    <string name="cc">Kad Kredit</string>
</resources>
`
  );

  zip.file(
    'app/src/main/res/xml/backup_rules.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <include domain="database" path="tabung_harapan_database.db" />
</full-backup-content>
`
  );

  zip.file(
    'app/src/main/res/xml/data_extraction_rules.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="database" path="tabung_harapan_database.db" />
    </cloud-backup>
    <device-transfer>
        <include domain="database" path="tabung_harapan_database.db" />
    </device-transfer>
</data-extraction-rules>
`
  );

  // GitHub Actions Workflow
  zip.file(
    '.github/workflows/build-apk.yml',
    `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build Tabung Harapan APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4

      - name: Build APK with Gradle
        run: |
          if [ -d "android" ] && [ -f "android/build.gradle.kts" ]; then
            cd android
          fi
          if [ ! -f "gradlew" ]; then
            gradle wrapper --gradle-version 8.7
          fi
          chmod +x gradlew
          ./gradlew assembleDebug --stacktrace
          find . -name "*debug.apk" -exec cp {} ./TabungHarapan.apk \;

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: TabungHarapan-APK
          path: '**/TabungHarapan.apk'
          retention-days: 14
`
  );

  // Kotlin source code
  const packagePath = 'app/src/main/java/com/tabungharapan2026/app';

  zip.file(
    `${packagePath}/MainActivity.kt`,
    `package com.tabungharapan2026.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.tabungharapan2026.app.ui.screens.MainAppScreen
import com.tabungharapan2026.app.ui.theme.TabungHarapanTheme
import com.tabungharapan2026.app.viewmodel.TabungViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: TabungViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TabungHarapanTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainAppScreen(viewModel = viewModel)
                }
            }
        }
    }
}
`
  );

  zip.file(
    `${packagePath}/ui/theme/Color.kt`,
    `package com.tabungharapan2026.app.ui.theme

import androidx.compose.ui.graphics.Color

val RosePrimary = Color(0xFFE11D48)
val RoseOnPrimary = Color(0xFFFFFFFF)
val RosePrimaryContainer = Color(0xFFFFE4E6)
val RoseOnPrimaryContainer = Color(0xFF9F1239)
val RoseBackground = Color(0xFFFFF5F7)
val RoseSurface = Color(0xFFFFFFFF)
val RoseSurfaceVariant = Color(0xFFFFECEF)
val RoseTextMain = Color(0xFF1E293B)
val RoseTextMuted = Color(0xFF64748B)

val MaybankGold = Color(0xFFD97706)
val AllianceBlue = Color(0xFF2563EB)
val EmeraldGreen = Color(0xFF059669)
`
  );

  zip.file(
    `${packagePath}/ui/theme/Theme.kt`,
    `package com.tabungharapan2026.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = RosePrimary,
    onPrimary = RoseOnPrimary,
    primaryContainer = RosePrimaryContainer,
    onPrimaryContainer = RoseOnPrimaryContainer,
    background = RoseBackground,
    surface = RoseSurface,
    surfaceVariant = RoseSurfaceVariant,
    onSurface = RoseTextMain,
    onSurfaceVariant = RoseTextMuted
)

@Composable
fun TabungHarapanTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
`
  );

  zip.file(
    `${packagePath}/ui/screens/MainAppScreen.kt`,
    `package com.tabungharapan2026.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tabungharapan2026.app.ui.theme.*
import com.tabungharapan2026.app.viewmodel.TabungViewModel
import java.text.DecimalFormat

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen(viewModel: TabungViewModel) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val currencyFormat = remember { DecimalFormat("#,##0.00") }

    val totalBaki by viewModel.totalBakiTabung.collectAsState()
    val tabungSaved by viewModel.tabungSavedTotal.collectAsState()
    val maybankSaved by viewModel.maybankSavedTotal.collectAsState()
    val allianceSaved by viewModel.allianceSavedTotal.collectAsState()

    val tabungList by viewModel.allTabung.collectAsState()
    val maybankList by viewModel.maybankList.collectAsState()
    val allianceList by viewModel.allianceList.collectAsState()
    val transaksiList by viewModel.allTransaksi.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "TABUNG HARAPAN",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = RoseTextMain
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = RoseBackground
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color.White,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Ringkasan") },
                    label = { Text("Ringkasan") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.ReceiptLong, contentDescription = "Transaksi") },
                    label = { Text("Transaksi") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.AccountBalanceWallet, contentDescription = "Tabung") },
                    label = { Text("Tabung") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.CreditCard, contentDescription = "CC") },
                    label = { Text("CC") }
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(RoseBackground)
        ) {
            when (selectedTab) {
                0 -> DashboardContent(totalBaki, tabungSaved, maybankSaved, allianceSaved, currencyFormat)
                1 -> TransaksiContent(transaksiList, currencyFormat)
                2 -> TabungContent(tabungList, currencyFormat)
                3 -> CCContent(maybankList, allianceList, currencyFormat)
            }
        }
    }
}

@Composable
fun DashboardContent(totalBaki: Double, tabungSaved: Double, maybankSaved: Double, allianceSaved: Double, format: DecimalFormat) {
    LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        item {
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(24.dp), colors = CardDefaults.cardColors(containerColor = RosePrimary)) {
                Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("BAKI TABUNG", color = Color.White.copy(alpha = 0.85f), fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("RM " + format.format(totalBaki), color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Tabung", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                            Text("RM " + format.format(tabungSaved), color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("CC Maybank", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                            Text("RM " + format.format(maybankSaved), color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("CC Alliance", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                            Text("RM " + format.format(allianceSaved), color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TabungContent(tabungList: List<com.tabungharapan2026.app.data.TabungEntity>, format: DecimalFormat) {
    LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(tabungList) { item ->
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(item.nama, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Jumlah Disimpan: RM " + format.format(item.jumlahDisimpan), color = RosePrimary, fontWeight = FontWeight.Bold)
                    Text("Sasaran: RM " + format.format(item.sasaran), fontSize = 12.sp, color = RoseTextMuted)
                }
            }
        }
    }
}

@Composable
fun CCContent(maybankList: List<com.tabungharapan2026.app.data.CCEntity>, allianceList: List<com.tabungharapan2026.app.data.CCEntity>, format: DecimalFormat) {
    var selectedCC by remember { mutableIntStateOf(0) }
    val currentList = if (selectedCC == 0) maybankList else allianceList
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        TabRow(selectedTabIndex = selectedCC, containerColor = Color.White) {
            Tab(selected = selectedCC == 0, onClick = { selectedCC = 0 }, text = { Text("CC Maybank") })
            Tab(selected = selectedCC == 1, onClick = { selectedCC = 1 }, text = { Text("CC Alliance") })
        }
        Spacer(modifier = Modifier.height(16.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(currentList) { item ->
                Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(item.perkara, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Jumlah Disimpan: RM " + format.format(item.jumlahDisimpan), color = RosePrimary, fontWeight = FontWeight.Bold)
                        Text("Perlu Disimpan: RM " + format.format(item.perluDisimpan), fontSize = 12.sp, color = RoseTextMuted)
                    }
                }
            }
        }
    }
}

@Composable
fun TransaksiContent(transaksiList: List<com.tabungharapan2026.app.data.TransaksiEntity>, format: DecimalFormat) {
    LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        items(transaksiList) { item ->
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
                Row(modifier = Modifier.padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Column {
                        Text(item.nama, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text(item.tarikh + " • " + item.kategori.uppercase(), fontSize = 11.sp, color = RoseTextMuted)
                    }
                    Text((if (item.jenis == "simpan") "+" else "-") + " RM " + format.format(item.jumlah), color = if (item.jenis == "simpan") EmeraldGreen else RosePrimary, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
`
  );

  zip.file(
    `${packagePath}/data/Entities.kt`,
    `package com.tabungharapan2026.app.data
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tabung_table")
data class TabungEntity(
    @PrimaryKey val id: String,
    val nama: String,
    val sasaran: Double,
    val jumlahDisimpan: Double,
    val catatan: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)

@Entity(tableName = "cc_table")
data class CCEntity(
    @PrimaryKey val id: String,
    val provider: String,
    val perkara: String,
    val perluDisimpan: Double,
    val jumlahDisimpan: Double,
    val catatan: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)

@Entity(tableName = "transaksi_table")
data class TransaksiEntity(
    @PrimaryKey val id: String,
    val tarikh: String,
    val nama: String,
    val kategori: String,
    val targetId: String?,
    val jumlah: Double,
    val jenis: String,
    val catatan: String,
    val status: String,
    val createdAt: String
)
`
  );

  zip.file(
    `${packagePath}/data/Daos.kt`,
    `package com.tabungharapan2026.app.data
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface TabungDao {
    @Query("SELECT * FROM tabung_table ORDER BY createdAt DESC")
    fun getAllTabung(): Flow<List<TabungEntity>>

    @Query("SELECT COALESCE(SUM(jumlahDisimpan), 0.0) FROM tabung_table WHERE status = 'active'")
    fun getActiveTotalSaved(): Flow<Double>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTabung(item: TabungEntity)

    @Update
    suspend fun updateTabung(item: TabungEntity)

    @Query("UPDATE tabung_table SET status = 'archived' WHERE id = :id")
    suspend fun archiveTabung(id: String)

    @Query("UPDATE tabung_table SET status = 'active' WHERE id = :id")
    suspend fun restoreTabung(id: String)

    @Query("DELETE FROM tabung_table WHERE id = :id")
    suspend fun deleteTabung(id: String)
}

@Dao
interface CCDao {
    @Query("SELECT * FROM cc_table WHERE provider = :provider ORDER BY createdAt DESC")
    fun getCCByProvider(provider: String): Flow<List<CCEntity>>

    @Query("SELECT COALESCE(SUM(jumlahDisimpan), 0.0) FROM cc_table WHERE provider = :provider AND status = 'active'")
    fun getActiveTotalSavedByProvider(provider: String): Flow<Double>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCC(item: CCEntity)

    @Update
    suspend fun updateCC(item: CCEntity)

    @Query("UPDATE cc_table SET status = 'archived' WHERE id = :id")
    suspend fun archiveCC(id: String)

    @Query("UPDATE cc_table SET status = 'active' WHERE id = :id")
    suspend fun restoreCC(id: String)

    @Query("DELETE FROM cc_table WHERE id = :id")
    suspend fun deleteCC(id: String)
}

@Dao
interface TransaksiDao {
    @Query("SELECT * FROM transaksi_table ORDER BY tarikh DESC")
    fun getAllTransaksi(): Flow<List<TransaksiEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaksi(item: TransaksiEntity)

    @Query("DELETE FROM transaksi_table WHERE id = :id")
    suspend fun deleteTransaksi(id: String)
}
`
  );

  zip.file(
    `${packagePath}/data/AppDatabase.kt`,
    `package com.tabungharapan2026.app.data
import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(entities = [TabungEntity::class, CCEntity::class, TransaksiEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun tabungDao(): TabungDao
    abstract fun ccDao(): CCDao
    abstract fun transaksiDao(): TransaksiDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "tabung_harapan_database.db"
                ).addCallback(object : RoomDatabase.Callback() {
                    override fun onCreate(db: SupportSQLiteDatabase) {
                        super.onCreate(db)
                        INSTANCE?.let { database ->
                            scope.launch(Dispatchers.IO) {
                                database.tabungDao().insertTabung(TabungEntity("t1", "Simpanan Kecemasan 2026", 5000.0, 800.0, "Dana 3 bulan", "active", "2026-01-01", "2026-01-01"))
                                database.tabungDao().insertTabung(TabungEntity("t2", "Tabung Raya & Ziarah", 2000.0, 513.80, "Persiapan raya", "active", "2026-01-05", "2026-01-05"))
                                database.ccDao().insertCC(CCEntity("c1", "maybank", "Bil Kad Maybank", 500.0, 300.0, "Penyata bulanan", "active", "2026-01-02", "2026-01-02"))
                                database.ccDao().insertCC(CCEntity("c2", "alliance", "Bil Kad Alliance", 400.0, 200.0, "Penyata bulanan", "active", "2026-01-04", "2026-01-04"))
                            }
                        }
                    }
                }).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  );

  zip.file(
    `${packagePath}/viewmodel/TabungViewModel.kt`,
    `package com.tabungharapan2026.app.viewmodel
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.tabungharapan2026.app.data.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class TabungViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application, viewModelScope)
    val allTabung = database.tabungDao().getAllTabung().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val maybankList = database.ccDao().getCCByProvider("maybank").stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val allianceList = database.ccDao().getCCByProvider("alliance").stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val allTransaksi = database.transaksiDao().getAllTransaksi().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val tabungSavedTotal = database.tabungDao().getActiveTotalSaved().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)
    val maybankSavedTotal = database.ccDao().getActiveTotalSavedByProvider("maybank").stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)
    val allianceSavedTotal = database.ccDao().getActiveTotalSavedByProvider("alliance").stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val totalBakiTabung = combine(tabungSavedTotal, maybankSavedTotal, allianceSavedTotal) { tabung, mb, al ->
        tabung + mb + al
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)
}
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
