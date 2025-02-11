"""Add exp

Revision ID: ef9edc9d40a5
Revises: f896ed236f22
Create Date: 2024-09-08 23:04:25.766642

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ef9edc9d40a5'
down_revision = 'f896ed236f22'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('exp', sa.Integer(), nullable=True))

    # Then update NULL values to 0
    op.execute('UPDATE user SET exp = 0 WHERE exp IS NULL')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('exp')

    # ### end Alembic commands ###
