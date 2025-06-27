import React from 'react';
import { Table, Text, Group, Button } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order: number;
  createdAt: Date;
  updatedAt?: Date;
  children?: Category[];
}

interface CategoryTreeTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryName: string) => void;
}

interface CategoryRowProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryName: string) => void;
}

function CategoryRow({ category, level, onEdit, onDelete }: CategoryRowProps) {
  return (
    <>
      <Table.Tr key={category.id}>
        <Table.Td style={{ paddingLeft: level * 20 + 12 }}>
          <Text fw={category.children?.length ? 600 : 400}>
            {category.name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed">{category.slug}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {category.description || '-'}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{category.order}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed">
            {new Date(category.createdAt).toLocaleDateString()}
          </Text>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Button
              size="xs"
              variant="light"
              color="blue"
              onClick={() => onEdit(category)}
              leftSection={<IconEdit size={14} />}
            >
              编辑
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => onDelete(category.id, category.name)}
              leftSection={<IconTrash size={14} />}
            >
              删除
            </Button>
          </Group>
        </Table.Td>
      </Table.Tr>
      {category.children?.map(child => (
        <CategoryRow
          key={child.id}
          category={child}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

export function CategoryTreeTable({ categories, onEdit, onDelete }: CategoryTreeTableProps) {
  return (
    <Table 
      verticalSpacing="sm" 
      highlightOnHover
      withTableBorder
      withColumnBorders
      striped
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>分类名称</Table.Th>
          <Table.Th>标识</Table.Th>
          <Table.Th>描述</Table.Th>
          <Table.Th w={80}>排序</Table.Th>
          <Table.Th w={120}>创建时间</Table.Th>
          <Table.Th w={140}>操作</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {categories.map(category => (
          <CategoryRow
            key={category.id}
            category={category}
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
} 