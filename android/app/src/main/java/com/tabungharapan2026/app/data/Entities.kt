package com.tabungharapan2026.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tabung_table")
data class TabungEntity(
    @PrimaryKey val id: String,
    val nama: String,
    val sasaran: Double,
    val jumlahDisimpan: Double,
    val catatan: String,
    val status: String, // "active" or "archived"
    val createdAt: String,
    val updatedAt: String
)

@Entity(tableName = "cc_table")
data class CCEntity(
    @PrimaryKey val id: String,
    val provider: String, // "maybank" or "alliance"
    val perkara: String,
    val perluDisimpan: Double,
    val jumlahDisimpan: Double,
    val catatan: String,
    val status: String, // "active" or "archived"
    val createdAt: String,
    val updatedAt: String
)

@Entity(tableName = "transaksi_table")
data class TransaksiEntity(
    @PrimaryKey val id: String,
    val tarikh: String,
    val nama: String,
    val kategori: String, // "tabung", "maybank", "alliance", "umum"
    val targetId: String?,
    val jumlah: Double,
    val jenis: String, // "simpan" or "keluar"
    val catatan: String,
    val status: String, // "active" or "archived"
    val createdAt: String
)
