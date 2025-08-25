import api from '@/libs/api';
import { ContactMessage, ContactMessageInput } from '@/types/contact';

const CONTACT_URL = '/contacts/public';

export class ContactService {
  async createMessage(data: ContactMessageInput): Promise<ContactMessage> {
    const res = await api.post<ContactMessage>(`${CONTACT_URL}`, data);
    return res.data;
  }
}
