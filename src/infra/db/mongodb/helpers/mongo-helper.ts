import { Collection, MongoClient } from "mongodb"

export const MongoHelper = {
  client: {} as MongoClient,
  //@ts-ignore
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
    // @ts-ignore
    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client || Object.keys(this.client).length === 0) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map: <T>(collectionInserted: any): T => {
    const { _id, ...collectionWithoutId } = collectionInserted!
    const collection = Object.assign({}, collectionWithoutId, { id: _id.toString() })
    /* const collection = {
      id: _id.toString(),
      name: collectionWithoutId.name,
      email: collectionWithoutId.email,
      password: collectionWithoutId.password
    } */
    return collection
  }
}
