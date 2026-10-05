package com.tabungharapan2026.app.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [TabungEntity::class, CCEntity::class, TransaksiEntity::class],
    version = 1,
    exportSchema = false
)
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
                )
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database.tabungDao(), database.ccDao(), database.transaksiDao())
                    }
                }
            }

            suspend fun populateInitialData(tabungDao: TabungDao, ccDao: CCDao, transaksiDao: TransaksiDao) {
                // Initial Tabung = RM 1,313.80
                tabungDao.insertTabung(TabungEntity("tabung-1", "Simpanan Kecemasan 2026", 5000.0, 800.0, "Dana rizab 3 bulan", "active", "2026-01-01", "2026-01-01"))
                tabungDao.insertTabung(TabungEntity("tabung-2", "Tabung Raya & Ziarah", 2000.0, 513.80, "Persiapan Hari Raya Aidilfitri", "active", "2026-01-05", "2026-01-05"))

                // CC Maybank = RM 300
                ccDao.insertCC(CCEntity("cc-mb-1", "maybank", "Bil Kad Maybank Ikhwan", 500.0, 300.0, "Peruntukan penyata bulanan Maybank", "active", "2026-01-02", "2026-01-02"))

                // CC Alliance = RM 200
                ccDao.insertCC(CCEntity("cc-al-1", "alliance", "Bil Kad Alliance Platinum", 400.0, 200.0, "Simpanan penyata kad Alliance", "active", "2026-01-04", "2026-01-04"))

                // Sample transactions
                transaksiDao.insertTransaksi(TransaksiEntity("tx-1", "2026-01-01", "Simpanan Kecemasan", "tabung", "tabung-1", 800.0, "simpan", "Gaji Januari", "active", "2026-01-01"))
                transaksiDao.insertTransaksi(TransaksiEntity("tx-2", "2026-01-05", "Simpanan Raya", "tabung", "tabung-2", 513.80, "simpan", "Lebihan bajet", "active", "2026-01-05"))
                transaksiDao.insertTransaksi(TransaksiEntity("tx-3", "2026-01-06", "Peruntukan Maybank", "maybank", "cc-mb-1", 300.0, "simpan", "Rizab kad kredit Maybank", "active", "2026-01-06"))
                transaksiDao.insertTransaksi(TransaksiEntity("tx-4", "2026-01-07", "Peruntukan Alliance", "alliance", "cc-al-1", 200.0, "simpan", "Rizab kad kredit Alliance", "active", "2026-01-07"))
            }
        }
    }
}
