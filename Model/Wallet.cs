using System;
using System.Collections.Generic;

namespace _2023pz_trrepo.Model
{
public class Wallet
    {
        //Transakcje do zrobienia w ramach śledzenia wydatków
        public string Name { get; set; }
        //public List<Transaction> Transactions { get; set; }

        public Wallet(string name)
        {
            Name = name;
           // Transactions = new List<Transaction>();
        }

      
    }

}