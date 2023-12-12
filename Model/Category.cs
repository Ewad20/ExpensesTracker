using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
		[ForeignKey("UserId")]
		public string? UserId { get; set; }
		public long IconId { get; set; }
	}
}
