
  # Veloom 🚲

  Site para alugar e-bikes que estão espalhadas por Aveiro. Pega uma e-bike, utiliza-a para onde quiseres sem teres de te preocupar em deixar num lugar específico (desde que fique num lugar acessível a todos).

  ## Veloom UI Design 

Este é o pacote de código para o Design de Interface do Veloom.  

  ## Running the code

  Pré-requisitos:
  - Git
  - Docker Desktop

  Passos
  1. Clona o repositório:
  git clone https://github.com/dotJoaoCosta/Veloom
  cd Veloom
  2. Certifica-te que o Docker Desktop está aberto e a correr
  3. Constrói e corre o contentor
  docker build -t veloom .
  docker run -p 8080:80 veloom
  4. Abre o browser e vai a
  http://localhost:8080
  
