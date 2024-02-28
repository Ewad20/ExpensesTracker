FROM mcr.microsoft.com/dotnet/sdk:7.0

WORKDIR /app

COPY . .

RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash 
RUN apt-get install -y nodejs

RUN dotnet build

RUN dotnet dev-certs https

RUN dotnet dev-certs https --trust

RUN dotnet tool restore

EXPOSE 7088 5169

# USER app

CMD ["sh", "-c", "dotnet ef migrations add init && dotnet ef database update && dotnet watch run -lp https"]
