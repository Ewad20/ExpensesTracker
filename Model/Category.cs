using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace _2023pz_trrepo.Model
{
	public class Category
	{
		[Key]
		public long Id { get; set; }

		public string Name { get; set; }

		public long IconId { get; set; }
	}
}
