package com.tabungharapan2026.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.tabungharapan2026.app.data.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class TabungViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application, viewModelScope)
    private val tabungDao = database.tabungDao()
    private val ccDao = database.ccDao()
    private val transaksiDao = database.transaksiDao()

    val allTabung: StateFlow<List<TabungEntity>> = tabungDao.getAllTabung()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val maybankList: StateFlow<List<CCEntity>> = ccDao.getCCByProvider("maybank")
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allianceList: StateFlow<List<CCEntity>> = ccDao.getCCByProvider("alliance")
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allTransaksi: StateFlow<List<TransaksiEntity>> = transaksiDao.getAllTransaksi()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Real-time calculations:
    val tabungSavedTotal: StateFlow<Double> = tabungDao.getActiveTotalSaved()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val maybankSavedTotal: StateFlow<Double> = ccDao.getActiveTotalSavedByProvider("maybank")
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val allianceSavedTotal: StateFlow<Double> = ccDao.getActiveTotalSavedByProvider("alliance")
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    // BAKI TABUNG = Tabung Aktif + Maybank Aktif + Alliance Aktif
    val totalBakiTabung: StateFlow<Double> = combine(
        tabungSavedTotal,
        maybankSavedTotal,
        allianceSavedTotal
    ) { tabung, mb, al ->
        tabung + mb + al
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    // Tabung Operations
    fun addTabung(nama: String, sasaran: Double, disimpan: Double, catatan: String) {
        viewModelScope.launch {
            val now = "2026-01-01"
            tabungDao.insertTabung(
                TabungEntity(
                    id = "tabung-${System.currentTimeMillis()}",
                    nama = nama,
                    sasaran = sasaran,
                    jumlahDisimpan = disimpan,
                    catatan = catatan,
                    status = "active",
                    createdAt = now,
                    updatedAt = now
                )
            )
        }
    }

    fun updateTabung(item: TabungEntity) {
        viewModelScope.launch {
            tabungDao.updateTabung(item)
        }
    }

    fun archiveTabung(id: String) {
        viewModelScope.launch {
            tabungDao.archiveTabung(id)
        }
    }

    fun restoreTabung(id: String) {
        viewModelScope.launch {
            tabungDao.restoreTabung(id)
        }
    }

    fun deleteTabung(id: String) {
        viewModelScope.launch {
            tabungDao.deleteTabung(id)
        }
    }

    // CC Operations
    fun addCC(provider: String, perkara: String, perlu: Double, disimpan: Double, catatan: String) {
        viewModelScope.launch {
            val now = "2026-01-01"
            ccDao.insertCC(
                CCEntity(
                    id = "cc-${System.currentTimeMillis()}",
                    provider = provider,
                    perkara = perkara,
                    perluDisimpan = perlu,
                    jumlahDisimpan = disimpan,
                    catatan = catatan,
                    status = "active",
                    createdAt = now,
                    updatedAt = now
                )
            )
        }
    }

    fun updateCC(item: CCEntity) {
        viewModelScope.launch {
            ccDao.updateCC(item)
        }
    }

    fun archiveCC(id: String) {
        viewModelScope.launch {
            ccDao.archiveCC(id)
        }
    }

    fun restoreCC(id: String) {
        viewModelScope.launch {
            ccDao.restoreCC(id)
        }
    }

    fun deleteCC(id: String) {
        viewModelScope.launch {
            ccDao.deleteCC(id)
        }
    }

    // Transaksi Operations
    fun addTransaksi(nama: String, tarikh: String, kategori: String, targetId: String?, jumlah: Double, jenis: String, catatan: String) {
        viewModelScope.launch {
            transaksiDao.insertTransaksi(
                TransaksiEntity(
                    id = "tx-${System.currentTimeMillis()}",
                    tarikh = tarikh,
                    nama = nama,
                    kategori = kategori,
                    targetId = targetId,
                    jumlah = jumlah,
                    jenis = jenis,
                    catatan = catatan,
                    status = "active",
                    createdAt = "2026-01-01"
                )
            )
        }
    }

    fun deleteTransaksi(id: String) {
        viewModelScope.launch {
            transaksiDao.deleteTransaksi(id)
        }
    }
}
