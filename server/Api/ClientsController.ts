import { AuthRequest } from '../Interfaces/AutorizationInterface';
import { Application, Response } from 'express';
import Constants from '../Constants';
import { addClient, deleteClientById, getClientById, getClientsByDoctorId, updateClient } from '../DB/Clients/ClientConnector';
import { AuthorizeService } from '../Services/AuthorizeService';
import { Client } from '../Interfaces/ClientsInterface';
import { clientValidation } from '../Helpers/Validation';

export class ClientsController {
    private readonly app: Application;
    private constants = Constants
    private defaultError: { error: string } = { error: "Can`t find the client(s)." }
    private validationError: { error: string } = { error: 'Validation Error: name ,surname ,sex ,age ,phone ,email are required values' }

    constructor(app: Application) {
        this.app = app
        this.setRequestHandlers()
    }

    private setRequestHandlers() {
        const { apiUrls: { client, clients } } = this.constants;
        this.app.get(clients, this.getClients)
        this.app.get(client, this.getClient)
        this.app.post(client, this.addClient)
        this.app.put(client, this.updateClient)
        this.app.delete(client, this.deleteClient)
    }

    private getClients = async (req: AuthRequest, res: Response) => {
        const { query: { doctorId = '' } } = req;
        const clients: Client[] = await getClientsByDoctorId(String(doctorId))
        if (clients?.length) {
            return res.json({ clients })
        }
        return res.json(this.defaultError)
    }

    private getClient = async (req: AuthRequest, res: Response) => {
        const { query: { id, doctorId = '' } } = req;

        const client: any = await getClientById(String(id), String(doctorId))
        const response = client || this.defaultError;
        res.json(response)
    }

    private updateClient = async (req: AuthRequest, res: Response) => {
        const { body } = req;
        const client: any = { ...body }
        if (client.id) {
            const data = await updateClient(client as Client, body.doctorId);
            return res.json(data)
        }

        return res.json(this.defaultError)
    }

    private addClient = async (req: AuthRequest, res: Response) => {
        const { body } = req;
        const newClient = { ...body, id: new Date().getTime().toString() }
        const client: any = clientValidation(newClient)
        if (!client.error) {
            const data = await addClient(client as Client)
            return res.json(data)
        }

        return res.json(client || this.validationError)
    }

    private deleteClient = async (req: AuthRequest, res: Response) => {
        const { query: { id, doctorId } } = req;
        const data: any = await deleteClientById(String(id), String(doctorId))
        if (data) {
            return res.json(data)
        }

        return res.json(this.defaultError)

    }
}
