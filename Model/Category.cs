using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace _2023pz_trrepo.Model
{

	public enum CategoryType
	{
		Expenditure,
		Income
	}
	public class Category
	{
		[Key]
		public long Id { get; set; }

		public string Name { get; set; }
		[JsonConverter(typeof(JsonStringEnumConverter))]
		public CategoryType Type { get; set; }

		public long IconId { get; set; }
	}
}
