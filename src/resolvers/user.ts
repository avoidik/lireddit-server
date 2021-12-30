import { User } from "../entities/User";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];
    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver(() => User)
export class UserResolver {
    @Mutation(() => UserResponse)
    public async register(@Arg('options') options: UsernamePasswordInput, @Ctx() ctx: MyContext) : Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{field: "username", message: "invalid length for username"}]
            };
        }
        if (options.password.length <= 5) {
            return {
                errors: [{field: "password", message: "invalid length for password"}]
            };
        }
        const userExists = await ctx.em.findOne(User, {username: options.username.toLowerCase()});
        if (userExists) {
            return {
                errors: [{field: "username", message: "the username is already exists"}]
            };
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = ctx.em.create(User, {username: options.username.toLowerCase(), password: hashedPassword});
        await ctx.em.persistAndFlush(user);

        ctx.req.session.userId = user.id;

        return {user: user};
    }

    @Query(() => UserResponse)
    public async login(@Arg('options') options: UsernamePasswordInput, @Ctx() ctx: MyContext) : Promise<UserResponse> {
        const user = await ctx.em.findOne(User, {username: options.username.toLowerCase()});
        if (!user) {
            return {
                errors: [{field: "username", message: "the username does not exist"}]
            };
        }
        const verified = await argon2.verify(user.password, options.password);
        if (!verified) {
            return {
                errors: [{field: "password", message: "invalid password for the user"}]
            };
        }

        ctx.req.session.userId = user.id;

        return {user: user};
    }

    @Query(() => User, {nullable: true})
    public async me(@Ctx() ctx: MyContext) : Promise<User | null> {
        if (!ctx.req.session.userId) {
            return null;
        }
        const user = await ctx.em.findOne(User, {id: ctx.req.session.userId});
        return user;
    }
}
