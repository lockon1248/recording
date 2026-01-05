const DB_NAME = 'recording-audio'
const STORE_NAME = 'clips'
const DB_VERSION = 1

type ClipRecord = {
  key: string
  blob: Blob
  updatedAt: number
}
const getKey = (caseId: string, itemId: number) => `${caseId}:${itemId}`

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })



const runTx = async <T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    const request = action(store)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
    tx.onabort = () => db.close()
  })
}

export const saveAudio = (caseId: string, itemId: number, blob: Blob) =>
  runTx('readwrite', store =>
    store.put({
      key: getKey(caseId, itemId),
      blob,
      updatedAt: Date.now()
    } as ClipRecord)
  )

export const loadAudio = (caseId: string, itemId: number) =>
  runTx<ClipRecord | undefined>('readonly', store => store.get(getKey(caseId, itemId)))

export const deleteAudio = (caseId: string, itemId: number) =>
  runTx('readwrite', store => store.delete(getKey(caseId, itemId)))
