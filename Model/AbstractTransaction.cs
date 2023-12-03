﻿using System.ComponentModel.DataAnnotations;

namespace _2023pz_trrepo.Model
{
    public abstract class AbstractTransaction
    {
        [Key]
        public long Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public double Amount { get; set; }
        public DateTime Date {  get; set; }
        public long WalletId { get; set; }
        public long CategoryId { get; set; }
        public abstract string TransactionType();
    }
}
