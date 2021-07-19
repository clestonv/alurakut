import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response) {

    if(request.method === 'POST') {
        const TOKEN = '6c020793fbc21b6534607d2debe693';
        const client = new SiteClient(TOKEN);
    
        const registroCriado = await client.items.create({
            itemType: "970546",
            ...request.body,
            // "Comundiade Teste",
            // imageUrl: "https://github.com/clestonv.png",
            // creatorSlug: "cleston"
        })

        console.log(registroCriado)

        response.json({
            nome: "Cleberson Osorio",          
            registroCriado: registroCriado
        })
        return;
    }

    response.status(404).json({
        message: "Ainda não temos nada no GET, mas no POST tem"
    })
    
}