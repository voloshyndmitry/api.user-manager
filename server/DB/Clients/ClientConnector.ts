import { Client } from '../../Interfaces/ClientsInterface';
import Mongo from '../mongoConnect';

const { client } = Mongo;
const dbName = 'medeordb';
const collection = 'manager.clients';

const getAllClients = async (): Promise<Client[]> => {
    const { clients } = await client.db(dbName).collection(collection)
        .findOne()
    return clients
}

const getClientsByDoctorId = async (id: string): Promise<Client[]> => {
    const clients: Client[] = await getAllClients();
    return clients.filter?.((user: Client) => user.doctorID === String(id))
}

const updateClient = async (updatedClient: Client, doctorId: string): Promise<Client | undefined> => {
    const clients: Client[] = await getAllClients();
    const data: Client[] = clients?.map?.(
        (client: Client) => client.id === updatedClient.id && client.doctorID === doctorId ?
            { ...client, ...updatedClient } :
            client)
    await client.db(dbName).collection(collection)
        .updateOne({}, { $set: { clients: data } });
    return data.find(client => client.id === updatedClient.id);
}

const addClient = async (data: Client): Promise<Client> => {
    const clients: Client[] = await getAllClients();
    await client.db(dbName).collection(collection)
        .updateOne({}, { $set: { clients: [...clients, data] } });
    return data;
}

const deleteClientById = async (id: string, doctorId: string): Promise<Client[]> => {
    const clients: Client[] = await getAllClients();
    const data: Client[] = clients?.filter?.((data: Client) => data.id !== id && data.doctorID === doctorId)
    await client.db(dbName).collection(collection)
        .updateOne({}, { $set: { clients: data } });
    return data;
}

const getClientById = async (id: string, doctorId: string): Promise<Client> => {
    const { clients: result } = await client.db(dbName).collection(collection)
        .findOne()
    return result?.find?.((user: Client) => user.id === id && user.doctorID === doctorId)
}

export {
    getClientById,
    getClientsByDoctorId,
    updateClient,
    addClient,
    deleteClientById
}