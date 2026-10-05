package com.tabungharapan2026.app.ui.screens

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
                    label = { Text("Ringkasan") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = RosePrimary,
                        selectedTextColor = RosePrimary,
                        indicatorColor = RosePrimaryContainer
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.ReceiptLong, contentDescription = "Transaksi") },
                    label = { Text("Transaksi") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = RosePrimary,
                        selectedTextColor = RosePrimary,
                        indicatorColor = RosePrimaryContainer
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.AccountBalanceWallet, contentDescription = "Tabung") },
                    label = { Text("Tabung") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = RosePrimary,
                        selectedTextColor = RosePrimary,
                        indicatorColor = RosePrimaryContainer
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.CreditCard, contentDescription = "CC") },
                    label = { Text("CC") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = RosePrimary,
                        selectedTextColor = RosePrimary,
                        indicatorColor = RosePrimaryContainer
                    )
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
                0 -> DashboardContent(
                    totalBaki = totalBaki,
                    tabungSaved = tabungSaved,
                    maybankSaved = maybankSaved,
                    allianceSaved = allianceSaved,
                    currencyFormat = currencyFormat,
                    onNavigateToTabung = { selectedTab = 2 },
                    onNavigateToCC = { selectedTab = 3 }
                )
                1 -> TransaksiContent(transaksiList, currencyFormat)
                2 -> TabungContent(tabungList, currencyFormat, viewModel)
                3 -> CCContent(maybankList, allianceList, currencyFormat, viewModel)
            }
        }
    }
}

@Composable
fun DashboardContent(
    totalBaki: Double,
    tabungSaved: Double,
    maybankSaved: Double,
    allianceSaved: Double,
    currencyFormat: DecimalFormat,
    onNavigateToTabung: () -> Unit,
    onNavigateToCC: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 8.dp, bottom = 24.dp)
    ) {
        // Hero Card Baki Tabung
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = RosePrimary)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "BAKI TABUNG",
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "RM ${currencyFormat.format(totalBaki)}",
                        color = Color.White,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    Divider(color = Color.White.copy(alpha = 0.2f), thickness = 1.dp)
                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Tabung", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                            Text("RM ${currencyFormat.format(tabungSaved)}", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("CC Maybank", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                            Text("RM ${currencyFormat.format(maybankSaved)}", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("CC Alliance", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                            Text("RM ${currencyFormat.format(allianceSaved)}", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }
        }

        // Kad CC Maybank
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(MaybankGold.copy(alpha = 0.15f), RoundedCornerShape(10.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.CreditCard, contentDescription = null, tint = MaybankGold)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("CC Maybank", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Text("Disimpan dalam Baki Tabung", fontSize = 12.sp, color = RoseTextMuted)
                            }
                        }
                        Text(
                            "RM ${currencyFormat.format(maybankSaved)}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = MaybankGold
                        )
                    }
                }
            }
        }

        // Kad CC Alliance
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(AllianceBlue.copy(alpha = 0.15f), RoundedCornerShape(10.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.CreditCard, contentDescription = null, tint = AllianceBlue)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("CC Alliance", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Text("Disimpan dalam Baki Tabung", fontSize = 12.sp, color = RoseTextMuted)
                            }
                        }
                        Text(
                            "RM ${currencyFormat.format(allianceSaved)}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = AllianceBlue
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TabungContent(
    tabungList: List<com.tabungharapan2026.app.data.TabungEntity>,
    currencyFormat: DecimalFormat,
    viewModel: TabungViewModel
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(tabungList) { item ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(item.nama, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text(
                            if (item.status == "active") "Aktif" else "Diarkib",
                            fontSize = 12.sp,
                            color = if (item.status == "active") EmeraldGreen else RoseTextMuted
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Jumlah Disimpan: RM ${currencyFormat.format(item.jumlahDisimpan)}", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = RosePrimary)
                    Text("Sasaran: RM ${currencyFormat.format(item.sasaran)}", fontSize = 12.sp, color = RoseTextMuted)
                    if (item.catatan.isNotBlank()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(item.catatan, fontSize = 12.sp, color = RoseTextMuted)
                    }
                }
            }
        }
    }
}

@Composable
fun CCContent(
    maybankList: List<com.tabungharapan2026.app.data.CCEntity>,
    allianceList: List<com.tabungharapan2026.app.data.CCEntity>,
    currencyFormat: DecimalFormat,
    viewModel: TabungViewModel
) {
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
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(item.perkara, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text(
                                if (item.status == "active") "Aktif (Masuk Baki)" else "Diarkib",
                                fontSize = 12.sp,
                                color = if (item.status == "active") RosePrimary else RoseTextMuted
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Jumlah Disimpan: RM ${currencyFormat.format(item.jumlahDisimpan)}", fontWeight = FontWeight.Bold, color = RosePrimary)
                        Text("Perlu Disimpan: RM ${currencyFormat.format(item.perluDisimpan)}", fontSize = 12.sp, color = RoseTextMuted)
                        if (item.catatan.isNotBlank()) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(item.catatan, fontSize = 12.sp, color = RoseTextMuted)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TransaksiContent(
    transaksiList: List<com.tabungharapan2026.app.data.TransaksiEntity>,
    currencyFormat: DecimalFormat
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        items(transaksiList) { item ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(item.nama, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("${item.tarikh} • ${item.kategori.uppercase()}", fontSize = 11.sp, color = RoseTextMuted)
                    }
                    Text(
                        "${if (item.jenis == "simpan") "+" else "-"} RM ${currencyFormat.format(item.jumlah)}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = if (item.jenis == "simpan") EmeraldGreen else RosePrimary
                    )
                }
            }
        }
    }
}
