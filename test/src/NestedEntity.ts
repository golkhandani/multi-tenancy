import {
    Alphabet,
    ValidationSchema,
    ArrayOf,
    UUID,
    Enum,
    Email, Numeric, NestedObject
} from "fastest-validator-nestjs";


@ValidationSchema({
    strict: true
})
class NestedEntity {
    @Alphabet({ min: 5 })
    prop7: string;
}

@ValidationSchema({
    strict: true
})
export class MyBody {
    @UUID()
    prop1: string;

    @Enum({ values: ["one", "two"] })
    prop2: "one" | "two";

    @Email()
    prop3: string;

    @Numeric({ positive: true })
    prop4: number;

    @NestedObject()
    prop5: NestedEntity;

    @ArrayOf({
        items: NestedEntity
    })
    prop6: NestedEntity[];
}
