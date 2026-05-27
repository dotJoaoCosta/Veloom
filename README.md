
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
  ```
  git clone https://github.com/dotJoaoCosta/Veloom
  cd Veloom
  ```
  3. Certifica-te que o Docker Desktop está aberto e a correr
  4. Constrói e corre o contentor
  ```
  docker build -t veloom .
  docker run -p 8080:80 veloom
  ```
  6. Abre o browser e vai a
  ```
  http://localhost:8080
  ```

  ## Site na núvem

Este é o link para o site na nuvem, nós usamos o Railway.
```
https://veloom-production.up.railway.app/
```

  ## 🔑Contas Demo
  
  Utlizador:
  - Nome: Maria Costa
  - Email: maria.costa@email.com
  - Password: maria123
  Admin:
  - Email: admin@veloom.pt
  - Password: admin123
  Parceiros:
  - Fórum Aveiro: partner@forumaveiro.pt / partner123
  - Glicínias Plaza: partner@glicinias.pt / partner123
  - Tech Solutions: partner@techsolutions.pt / partner123
