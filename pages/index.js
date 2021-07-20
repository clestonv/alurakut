import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/components/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function  ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
          <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }}></img>
          <hr/>
          
          <p>
            <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
              @{propriedades.githubUser}
            </a>
          </p>
          <hr />

          <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox( propriedades ) {
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            {propriedades.title} ({propriedades.items.length })
          </h2>

          <ul>
            {/* {pessoasFavoritas.map((itemAtual) => {
              return (
                <li key={ itemAtual }>
                  <a href={`/users/${itemAtual}`}>
                  <img src={`https://github.com/${itemAtual}.png`} />
                  <span>{itemAtual}</span>
                </a>
                </li>
              )
            })} */}
          </ul>
        </ProfileRelationsBoxWrapper> 
  )
}

export default function Home(props) {
  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades ] = React.useState([])
  console.log('Nosso teste')
  // const comunidades = ['Alurakut'];
  const pessoasFavoritas = [
    'omariosouto',
    'marcobrunodev',
    'gustavoguanabara',
    'maykbrito',
    'loiane',
    'filipedeschamps'
  ]

  const [seguidores, setSeguidores] = React.useState([]);
  // 0 - Pegar o array de dados do GitHub  
  React.useEffect(function() {
    // GET
    fetch('https://api.github.com/users/peas/followers')
    .then(function (respostaDoServidor ) {
      return respostaDoServidor.json();
    }).then( function ( respostaCompleta ) {
      setSeguidores( respostaCompleta );
    })

    //API GraphQL
    fetch('https://graphql.datocms.com/',{
      method: 'POST',
      headers: {
        'Authorization': '6c020793fbc21b6534607d2debe693',
        'Content-Type':'aplication/json',
        'Accept':'application/json',
      },
      body : JSON.stringify({
        "query": `query {
          allCommunities {
            title
            id
            imageUrl
            creatorSlug
          }
        }` })
    })
    .then((response)=> response.json())
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidades)
      setComunidades(comunidadesVindasDoDato)

      
    })

  }, [])

  console.log('Seguidores antes do return', seguidores );
  // 1 - Criar um box que vai ter um map, baseado nos items do array que pegamos do GitHub

  return (
    <>
    <AlurakutMenu githubUser={usuarioAleatorio}/>
    <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea'}}>
        <ProfileSidebar githubUser={usuarioAleatorio}/>
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="smallTitle">
            Bem Vindo(a), 
          </h1>

        <OrkutNostalgicIconSet />
        </Box>

        <Box>
          <h2 className="subTitle">
            O que você deseja fazer?
          </h2>

          <form onSubmit={function handleCriarComunidade(e){
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);
            console.log(dadosDoForm);
            // comunidades.push('Alura Stars')

            const comunidade = {             
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              creatorSlug: usuarioAleatorio
            }

            fetch('/api/comunidades', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(comunidade)
            })
            .then(async (response) => {
              const dados = await response.json();
              console.log(dados)

            const comunidadesAtualizadas = [
            ...comunidades,
              comunidade
            ];

            setComunidades(comunidadesAtualizadas)
            console.log(comunidadesAtualizadas);
            })

            
          }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>  
            <div>
              <input 
                placeholder="Coloque uma URL para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa"
              />
            </div> 

            <button>
              Criar comunidade
            </button>          
          </form>
        </Box>
 
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBox title="Seguidores" items={seguidores}/>
        <ProfileRelationsBoxWrapper>  
            <h2 className="smallTitle">
              Comunidades ({ comunidades.length })
            </h2>       
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={ itemAtual.id }>
                    <a href={`/users/${itemAtual.title}`}>
                    <img src={itemAtual.imageUrl} />
                    <span>{itemAtual.title}</span>
                  </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({ pessoasFavoritas.length })
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={ itemAtual }>
                    <a href={`/users/${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>  
      </div>
      
    </MainGrid>
    </>
  )
  
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { githubUser } = jwt.decode(token);
  
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  }).then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: {
      githubUser
    },
  }
}
