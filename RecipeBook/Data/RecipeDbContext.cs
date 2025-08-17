using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using RecipeBook.Models;

namespace RecipeBook.Data;

public partial class RecipeDbContext : DbContext
{
    public RecipeDbContext()
    {
    }

    public RecipeDbContext(DbContextOptions<RecipeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Ingredient> Ingredients { get; set; }

    public virtual DbSet<Measurement> Measurements { get; set; }

    public virtual DbSet<Quantity> Quantities { get; set; }

    public virtual DbSet<Recipe> Recipes { get; set; }

    public virtual DbSet<Recipe_step> Recipe_steps { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=RecipeBook;Username=postgres;Password=passwd");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ingredient>(entity =>
        {
            entity.HasKey(e => e.ingredient_id).HasName("ingredient_pkey");

            entity.ToTable("Ingredient");

            entity.HasIndex(e => e.ingredient_name, "ingredient_name_unique").IsUnique();

            entity.Property(e => e.ingredient_id)
                .UseIdentityAlwaysColumn()
                .HasIdentityOptions(null, null, 0L, null, null, null);
        });

        modelBuilder.Entity<Measurement>(entity =>
        {
            entity.HasKey(e => e.measurement_id).HasName("measurement_pkey");

            entity.ToTable("Measurement");

            entity.HasIndex(e => e.measurement_name, "measurement_name_unique").IsUnique();

            entity.Property(e => e.measurement_id)
                .UseIdentityAlwaysColumn()
                .HasIdentityOptions(null, null, 0L, null, null, null);
        });

        modelBuilder.Entity<Quantity>(entity =>
        {
            entity.HasKey(e => e.quantity_id).HasName("quantities_pkey");

            entity.ToTable("Quantity");

            entity.HasIndex(e => e.quantity_id, "quantity_id_unique").IsUnique();

            entity.Property(e => e.quantity_id)
                .UseIdentityAlwaysColumn()
                .HasIdentityOptions(null, null, 0L, null, null, null);

            entity.HasOne(d => d.ingredient).WithMany(p => p.Quantities)
                .HasForeignKey(d => d.ingredient_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ingredient_fk");

            entity.HasOne(d => d.measurement).WithMany(p => p.Quantities)
                .HasForeignKey(d => d.measurement_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("measurement_fk");

            entity.HasOne(d => d.recipe).WithMany(p => p.Quantities)
                .HasForeignKey(d => d.recipe_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_fk");
        });

        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(e => e.recipe_id).HasName("recipe_pkey");

            entity.ToTable("Recipe");

            entity.HasIndex(e => e.recipe_id, "recipe_id_unique").IsUnique();

            entity.Property(e => e.recipe_id)
                .UseIdentityAlwaysColumn()
                .HasIdentityOptions(null, null, 0L, null, null, null);

            entity.HasMany(d => d.tags).WithMany(p => p.recipes)
                .UsingEntity<Dictionary<string, object>>(
                    "Recipe_tag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("tag_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("tag_fk"),
                    l => l.HasOne<Recipe>().WithMany()
                        .HasForeignKey("recipe_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("recipe_fk"),
                    j =>
                    {
                        j.HasKey("recipe_id", "tag_id").HasName("recipe_tag_pkey");
                        j.ToTable("Recipe_tag");
                        j.HasIndex(new[] { "recipe_id" }, "fki_recipe_fk");
                        j.HasIndex(new[] { "tag_id" }, "fki_tag_fk");
                    });
        });

        modelBuilder.Entity<Recipe_step>(entity =>
        {
            entity.HasKey(e => new { e.recipe_id, e.step_number }).HasName("recipe_steps_pkey");

            entity.ToTable("Recipe_step");

            entity.Property(e => e.step_number)
                .ValueGeneratedOnAdd()
                .UseIdentityAlwaysColumn()
                .HasIdentityOptions(null, 10L, 0L, null, null, null);

            entity.HasOne(d => d.recipe).WithMany(p => p.Recipe_steps)
                .HasForeignKey(d => d.recipe_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_step");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.tag_id).HasName("tag_pkey");

            entity.ToTable("Tag");

            entity.HasIndex(e => e.tag_name, "tag_name_unique").IsUnique();

            entity.Property(e => e.tag_id)
                .UseIdentityAlwaysColumn()
                .HasIdentityOptions(null, null, 0L, null, null, null);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
