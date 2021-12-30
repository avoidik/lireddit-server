import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

@Resolver(() => Post)
export class PostResolver {
  @Query(() => [Post])
  public async posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  public async post(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<Post | null> {
    return ctx.em.findOne(Post, {id: id});
  }

  @Mutation(() => Post)
  public async createPost(@Arg('title', () => String) title: string, @Ctx() ctx: MyContext): Promise<Post> {
    const post = ctx.em.create(Post, {title: title});
    await ctx.em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  public async updatePost(@Arg('id', () => Int) id: number, @Arg('title', () => String, {nullable: true}) title: string, @Ctx() ctx: MyContext): Promise<Post | null> {
    const post = await ctx.em.findOne(Post, {id: id});
    if (post) {
      post.title = title;
      await ctx.em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  public async deletePost(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<boolean> {
    const post = await ctx.em.findOne(Post, {id: id});
    if (post) {
      await ctx.em.remove(post).flush();
      return true;
    }
    return false;
  }
}
