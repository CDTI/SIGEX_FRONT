Este projeto utiliza o plugin editorconfig. Instale para manter o style guide de novos arquivos.



A minha ideia inicial era organizar o projeto em uma arquitetura de 3 camadas: app, módulos e infraestrutura. A camada app é responsável por redirecionar as requisições aos módulos adequados, manter configurações do aplicativo, renderizar páginas de erro, como o 404, renderizar os layouts e gerenciar autenticação de usuário e algumas autorizações. Dentro da camada módulos estariam cada uma das funcionalidades do app com suas respoectivas lógicas, páginas, rotas internas e componentes. Por fim, a camada de infraestrutura é responsável por gerenciar os stores e fornecer acesso aos endpoints. Como React não é Angular, uma camada de domínio é um pouco overkill pra esse projeto, mas poderia ser útil para formatar direito os dados que vem do servidor.

O usuário interage primeiramente com a camada app, onde estão os layouts e as rotas base. A camada app passaria o resto da requisição à um dos módulos, que será resposável por renderizar as páginas. Por exemplo, se eu acesso a página "/", a camada app recebe essa requisição, verifica em suas rotas e me redireciona pro módulo "/home" que irá achar um jeito de renderizar a página.

Como é possível ver pela estrutura do projeto, não tive tempo de executar essa ideia.



A autenticação do app funciona com um JWT básico gerado pelo servidor e enviado ao app. No login o servidor responde com um token que não expira e um objeto de usuário. A autorização é feita diretamente no aplicativo, sobre o nome das roles. Recomendo analisar a possibilidade de adotar o padrão OIDC para autenticação e autorização, uma vez que as permissões de acesso poderiam ser armazenadas no servidor e os tokens tem tempo de vida.

O fluxo para alteração de senha caso o usuário esqueça é o seguinte:
- usuário pede para administrador rester sua senha
- administrador acessa a plataforma e marca usuário para alteração de senha
- usuário clica em esqueci senha e digita informações necessárias
- usuário digita nova senha

Esse fluxo não é o ideal. O certo seria mandar um email ao usuário, mas os servidores do positivo bloqueiam emails enviados de aplicativos.



As requisições são enviadas através do hook useHttpClient(). O uso do cliente do axios diretamente impossibilita requisições canceláveis (muio úteis em formulários dentro de modais canceláveis e necessários para acabar com o aviso de alteração de estado depois que um componente foi desmontado).

Os endpoints estão dentro da pasta "endpoints" na pasta services. É interessante retornar um objeto contendo o método HTTP e a uri (ex.: { method: "GET", url: "/path/to/resource" }). Como eu cheguei a essa conclusão depois e eu não tive tempo de eliminar todas as ocorrências de requisição ao servidor da forma antiga, o projeto está um pouco bagunçado nesse quesito.



Recomendo ler bem a documentação do antd, ainda que algumas coisas não sejam bem documentadas. Algumas dicas:
- para formulários em vários passos, utilize um único controlador em um HoC e o passe aos componentes que irão definir os Forms, mantendo o botão de submit no Form.Provider dentro do HoC. Assim, sempre que um dos Forms emitir um evento, o Form.Provider consegue capturá-lo e tratá-lo.
- se existirem campos que mapeiam a um objeto aninhado, passe um array na prop name do Form.Item (ex.: para um objeto da forma { a: { b: string }, utilize Form.Item name={["a", "b"]})

Recomendo também conversar com o Diogo pra entender bem como funciona todo o processo dos projetos de extensão.



Pra executar o projeto em dev abra um terminal e digite "yarn dev".
