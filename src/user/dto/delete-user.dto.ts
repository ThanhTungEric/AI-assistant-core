import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
    @IsInt({ message: 'ID must be an integer' })
    @IsNotEmpty({ message: 'ID is required' })
    id: number;
}

