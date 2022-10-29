import React, { useEffect, useState } from 'react';
import Header from "../../header";
import Footer from "../../footer";
import axios from 'axios';

import '../../css/playlist.css'
import '../../css/musicas.css'


function Musicas(){

    let usuarioString = localStorage.getItem('usuarioLogado')
    let usuarioLogado = JSON.parse(usuarioString) 

    const [musicas, setMusicas] = useState([]);
    const [busca, setBusca] = useState('');

    const [musicaAdicionar, setMusicaAdicionar] = useState();
    const [usuarioNovo, setUsuarioNovo] = useState();

    function atualizaBusca(e){
        let valorDigitado = e.target.value;
        setBusca(valorDigitado);
    }


    useEffect( () => {   // Após o componente ser renderizado -- Set nas musicas com os dados da porta
        axios.get(`http://localhost:3001/musicas`)
            .then((resposta) => setMusicas(resposta.data))
    },[])


    const musicasFiltradas = musicas
        .filter((musica) => musica.nome.toLowerCase().includes(busca.toLowerCase()));

    

    function adicionarMusica(e){

        const musicasSalvas = usuarioLogado.playlists[0].musicas

        musicasSalvas.push(musicaAdicionar)

        let idMusica = e.target.value;

        axios.get(`http://localhost:3001/musicas/${idMusica}`)
            .then((res) => setMusicaAdicionar(res.data))

       axios.put(`http://localhost:3001/usuarios/${usuarioLogado.id}`, {
           nome: usuarioLogado.nome,
           idade: usuarioLogado.idade,
           email: usuarioLogado.email,
           senha: usuarioLogado.senha,
           playlists: [
               {
                   id: usuarioLogado.playlists[0].id,
                   nome: usuarioLogado.playlists[0].nome,
                   capa: usuarioLogado.playlists[0].capa,
                   musicas: musicasSalvas 
               }
           ]
               
        
       })

       axios.get(`http://localhost:3001/usuarios/${usuarioLogado.id}`)
            .then( (res) => setUsuarioNovo(res.data))

       localStorage.setItem('usuarioLogado', JSON.stringify(usuarioNovo))
            

        alert(`Música "${musicaAdicionar.nome}" adicionada com sucesso`) // APARECENDO ALERT REPETIDO PQ A RES DA CHAMADA NAO CHEGOU AINDA
    }
        
        
    const resultado = musicasFiltradas?.map( (m) => { 
        return(
            <div>
                <li className='musica'>
                    <h4 className='nome'>{m.nome}</h4>
                    <p className='artista'>{m.artista}</p>
                    <audio src={m.audio} className='audio' controls></audio>
                    {usuarioString && <button className='btn-adicionar' onClick={adicionarMusica} value={m.id}>+ Minha playlist</button>}
                </li>
            </div>
        )
    })


    return(
        <div>
            <Header/>
            <main className='musicas-main'>
                <h2 className='title-musicas'>Musicas</h2>
                <input type='text' className='buscador' placeholder='Buscar músicas' value={busca} onChange={atualizaBusca}></input>
                <div className="musicas">
                    <ol>
                        {resultado}
                    </ol>
                </div>

            </main>
            <Footer/>
        </div>
    )
}

export default Musicas;