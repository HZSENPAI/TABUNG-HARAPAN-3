package com.tabungharapan2026.app.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface TabungDao {
    @Query("SELECT * FROM tabung_table ORDER BY createdAt DESC")
    fun getAllTabung(): Flow<List<TabungEntity>>

    @Query("SELECT * FROM tabung_table WHERE status = 'active' ORDER BY createdAt DESC")
    fun getActiveTabung(): Flow<List<TabungEntity>>

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

    @Query("SELECT * FROM cc_table ORDER BY createdAt DESC")
    fun getAllCC(): Flow<List<CCEntity>>

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
    @Query("SELECT * FROM transaksi_table ORDER BY tarikh DESC, createdAt DESC")
    fun getAllTransaksi(): Flow<List<TransaksiEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaksi(item: TransaksiEntity)

    @Update
    suspend fun updateTransaksi(item: TransaksiEntity)

    @Query("DELETE FROM transaksi_table WHERE id = :id")
    suspend fun deleteTransaksi(id: String)
}
